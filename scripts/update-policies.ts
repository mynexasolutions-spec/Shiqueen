import postgres from "postgres";
import { DEFAULT_PAGES } from "../lib/content/default-pages";
import { DEFAULT_CONTENT } from "../lib/content/defaults";
import { COLLECTIONS_DATA } from "../lib/collections-data";
import { VISUAL_CATEGORIES } from "../lib/brand-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });

  try {
    console.log("1. Syncing policy pages...");
    for (const page of DEFAULT_PAGES) {
      await sql`
        insert into pages (slug, title, body, is_published, updated_at)
        values (${page.slug}, ${page.title}, ${page.body}, ${page.published}, now())
        on conflict (slug) do update set
          title = excluded.title,
          body = excluded.body,
          is_published = excluded.is_published,
          updated_at = now()
      `;
      console.log(`✔ Synced page: ${page.slug}`);
    }

    await sql`delete from pages where slug = 'returns-and-exchanges'`;

    console.log("2. Syncing storefront content settings...");
    const contentKeys: (keyof typeof DEFAULT_CONTENT)[] = [
      "announcements",
      "hero",
      "home",
      "gifting",
      "footer",
      "product_page",
    ];

    for (const key of contentKeys) {
      await sql`
        insert into settings (key, value)
        values (${`content.${key}`}, ${sql.json(DEFAULT_CONTENT[key] as never)})
        on conflict (key) do update set value = excluded.value
      `;
      console.log(`✔ Synced setting: content.${key}`);
    }

    console.log("3. Syncing category cards including Oxidised & Mangalsutras...");
    let order = 0;
    for (const col of Object.values(COLLECTIONS_DATA)) {
      const visual = VISUAL_CATEGORIES.find((v) => v.id === col.slug);
      await sql`
        insert into categories (name, slug, tagline, description, badge, image_url, sort_order, show_on_home, is_active)
        values (
          ${col.name},
          ${col.slug},
          ${visual?.tagline ?? col.tagline},
          ${col.description},
          ${visual?.badge ?? col.badge},
          ${visual?.image ?? col.bannerImage},
          ${order++},
          true,
          true
        )
        on conflict (slug) do update set
          name = excluded.name,
          tagline = excluded.tagline,
          description = excluded.description,
          badge = excluded.badge,
          image_url = excluded.image_url,
          show_on_home = true,
          is_active = true
      `;
      console.log(`✔ Synced category: ${col.slug} (${col.name})`);
    }

    console.log("All updates completed and synced to database successfully!");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
