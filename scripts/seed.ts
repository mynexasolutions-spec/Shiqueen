// Seeds the database with the existing storefront catalogue, default coupons,
// store settings and (optionally) an admin account.
//
// Usage:
//   npm run db:seed
//   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='...' npm run db:seed
//
// Safe to re-run: existing categories/products/coupons (matched by slug/code) are
// left untouched. When admin credentials are passed, that user is created or
// promoted to admin and the password is (re)set.
import postgres from "postgres";
import { COLLECTIONS_DATA, MVP_PRODUCTS, getProductSpecifications } from "../lib/collections-data";
import { VISUAL_CATEGORIES } from "../lib/brand-data";
import { hashPassword, passwordProblem } from "../lib/server/password";
import { DEFAULT_SETTINGS } from "../lib/settings-defaults";
import { DEFAULT_CONTENT } from "../lib/content/defaults";
import { DEFAULT_PAGES } from "../lib/content/default-pages";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const FINISHES = ["18K Gold Plated", "Rose Gold", "Silver"];

const FEATURED = new Set([
  "aura-triple-bar-necklace",
  "luxe-solitaire-hoops",
  "eternal-paperclip-cuff",
  "starlight-stacking-trio",
  "royale-jubilee-watch",
  "noor-kundan-choker-set",
  "queens-keepsake-hamper",
  "blush-rose-jewelry-bouquet",
]);

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });

  try {
    // ── Settings ──
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await sql`insert into settings (key, value) values (${key}, ${sql.json(value as never)}) on conflict (key) do nothing`;
    }
    console.log("✔ Settings");

    // ── Storefront content (Admin → Storefront) ──
    for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
      await sql`insert into settings (key, value) values (${`content.${key}`}, ${sql.json(value as never)}) on conflict (key) do nothing`;
    }
    console.log("✔ Storefront content");

    // ── Information pages (drafts — review, then publish in Admin → Pages) ──
    for (const page of DEFAULT_PAGES) {
      await sql`insert into pages (slug, title, body, is_published) values (${page.slug}, ${page.title}, ${page.body}, ${page.published})
                on conflict (slug) do nothing`;
    }
    console.log("✔ Pages");

    // ── Categories (top level + sub-categories) ──
    const categoryIds = new Map<string, string>(); // slug -> id
    let order = 0;
    for (const col of Object.values(COLLECTIONS_DATA)) {
      const visual = VISUAL_CATEGORIES.find((v) => v.id === col.slug);
      const [row] = await sql`
        insert into categories (name, slug, tagline, description, badge, image_url, sort_order)
        values (${col.name}, ${col.slug}, ${visual?.tagline ?? col.tagline}, ${col.description}, ${col.badge}, ${col.bannerImage}, ${order++})
        on conflict (slug) do update set slug = excluded.slug
        returning id`;
      categoryIds.set(col.slug, row.id);

      let subOrder = 0;
      for (const sub of col.subcategories.filter((s) => s !== "All")) {
        const subSlug = `${col.slug}-${slugify(sub)}`;
        const [subRow] = await sql`
          insert into categories (parent_id, name, slug, image_url, sort_order, show_on_home)
          values (${row.id}, ${sub}, ${subSlug}, ${col.bannerImage}, ${subOrder++}, false)
          on conflict (slug) do update set slug = excluded.slug
          returning id`;
        categoryIds.set(subSlug, subRow.id);
      }
    }
    console.log(`✔ Categories (${categoryIds.size})`);

    // ── Products ──
    let created = 0;
    for (const p of MVP_PRODUCTS) {
      const subSlug = `${p.collectionSlug}-${slugify(p.subcategory)}`;
      const categoryId = categoryIds.get(subSlug) ?? categoryIds.get(p.collectionSlug) ?? null;
      const specs = getProductSpecifications(p);
      const [row] = await sql`
        insert into products (name, slug, category_id, description, price, compare_at_price, stock, status,
                              is_featured, badge, plating, material, features, specifications, finishes)
        values (${p.name}, ${p.slug}, ${categoryId}, ${p.description}, ${p.price}, ${p.originalPrice},
                ${p.inStock ? 50 : 0}, 'active', ${FEATURED.has(p.slug)}, ${p.badge}, ${p.plating}, ${p.material},
                ${p.features}, ${sql.json(specs as never)}, ${FINISHES})
        on conflict (slug) do nothing
        returning id`;
      if (!row) continue;
      created++;
      const images = [...new Set([p.primaryImage, p.hoverImage].filter(Boolean))];
      for (const [i, img] of images.entries()) {
        await sql`insert into product_images (product_id, url, alt, sort_order) values (${row.id}, ${img}, ${p.name}, ${i})`;
      }
    }
    console.log(`✔ Products (${created} new)`);
    // Existing products from before finishes existed keep the three original finish choices.
    await sql`update products set finishes = ${FINISHES} where finishes = '{}'`;

    // ── Coupons (match the codes already advertised on the storefront) ──
    const coupons = [
      { code: "B1G1QUEEN", description: "Buy 2 or more, save 25%", type: "percent", value: 25, min_items: 2, badge: "Save 25%", title: "Buy 2, save big", text: "Add any 2 pieces and get 25% off your bag", subtext: "+ Extra discount on prepaid orders", order: 1 },
      { code: "ROYAL50", description: "Buy 3 or more, save 35%", type: "percent", value: 35, min_items: 3, badge: "Save 35%", title: "Royal Bundle Privilege", text: "Buy 3 or more pieces and get 35% off", subtext: "Mix & match across collections", order: 2 },
      { code: "NEW50", description: "₹50 off your first purchase", type: "fixed", value: 50, min_items: 0, badge: "Save ₹50", title: "Welcome Queen Offer", text: "Extra ₹50 off on your first purchase", subtext: "+ Extra discount on prepaid orders", order: 3 },
    ];
    for (const c of coupons) {
      await sql`
        insert into coupons (code, description, type, value, min_items, show_as_offer, offer_badge, offer_title, offer_text, offer_subtext, offer_order)
        values (${c.code}, ${c.description}, ${c.type}, ${c.value}, ${c.min_items}, true, ${c.badge}, ${c.title}, ${c.text}, ${c.subtext}, ${c.order})
        on conflict (code) do update set
          show_as_offer = coupons.show_as_offer or (coupons.offer_title = ''),
          offer_badge = case when coupons.offer_title = '' then excluded.offer_badge else coupons.offer_badge end,
          offer_title = case when coupons.offer_title = '' then excluded.offer_title else coupons.offer_title end,
          offer_text = case when coupons.offer_title = '' then excluded.offer_text else coupons.offer_text end,
          offer_subtext = case when coupons.offer_title = '' then excluded.offer_subtext else coupons.offer_subtext end,
          offer_order = case when coupons.offer_title = '' then excluded.offer_order else coupons.offer_order end`;
    }
    console.log("✔ Coupons");

    // ── Admin ──
    const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (email && password) {
      const problem = passwordProblem(password);
      if (problem) throw new Error(`Admin password rejected: ${problem}`);
      const hash = await hashPassword(password);
      await sql`
        insert into users (email, password_hash, name, role, email_verified_at)
        values (${email}, ${hash}, 'Shiqueen Admin', 'admin', now())
        on conflict (email) do update
          set password_hash = excluded.password_hash, role = 'admin',
              email_verified_at = coalesce(users.email_verified_at, now()),
              is_active = true, failed_login_count = 0, locked_until = null, updated_at = now()`;
      console.log(`✔ Admin account ready: ${email}`);
    } else {
      console.log("• Skipped admin (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)");
    }
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
