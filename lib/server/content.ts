import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "./db";
import { getSettings } from "./settings";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import type { ContentKey, SiteContent } from "@/lib/content/types";
import { toPublicSettings } from "@/lib/settings-defaults";
import type { PublicSite } from "@/lib/site-types";

/** Storefront content, public settings, offers and featured reviews share this tag. */
export const CONTENT_TAG = "content";

export async function readContent(): Promise<SiteContent> {
  const rows = await sql<{ key: string; value: Record<string, unknown> }[]>`
    select key, value from settings where key like 'content.%'`;
  const content = structuredClone(DEFAULT_CONTENT) as unknown as Record<string, Record<string, unknown>>;
  for (const r of rows) {
    const k = r.key.slice("content.".length) as ContentKey;
    if (k in content && r.value && typeof r.value === "object") content[k] = { ...content[k], ...r.value };
  }
  return content as unknown as SiteContent;
}

/** Everything the storefront needs that isn't per-product, in one cached read. */
export async function getPublicSite(): Promise<PublicSite> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours"); // hours (not days) so coupon start/end dates take effect on time

  const [content, settings] = await Promise.all([readContent(), getSettings()]);

  const offers = await sql<PublicSite["offers"]>`
    select code::text as code, offer_badge as badge, offer_title as title, offer_text as text, offer_subtext as subtext
    from coupons
    where show_as_offer and is_active
      and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now())
      and (usage_limit is null or used_count < usage_limit)
    order by offer_order, created_at`;

  const featuredReviews = await sql<PublicSite["featuredReviews"]>`
    select r.id, r.author_name as author, r.location, r.rating, r.title, r.body, r.verified_purchase as verified,
           p.name as product_name, p.slug as product_slug
    from reviews r join products p on p.id = r.product_id
    where r.status = 'approved' and r.is_featured and p.status = 'active'
    order by r.created_at desc limit 12`;

  const pages = await sql<{ slug: string }[]>`select slug from pages where is_published`;

  return {
    content,
    settings: toPublicSettings(settings),
    offers: offers.map((o) => ({ ...o })),
    featuredReviews: featuredReviews.map((r) => ({ ...r })),
    publishedPages: pages.map((p) => p.slug),
    year: new Date().getFullYear(),
  };
}
