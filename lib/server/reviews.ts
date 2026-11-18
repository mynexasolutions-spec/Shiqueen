import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "./db";
import { CATALOG_TAG } from "./catalog";
import type { PublicReview } from "@/lib/site-types";

const select = sql`
  select r.id, r.author_name as author, r.location, r.rating, r.title, r.body,
         r.verified_purchase as verified, r.admin_reply as reply, r.created_at,
         p.name as product_name, p.slug as product_slug,
         (select i.url from product_images i where i.product_id = p.id order by i.sort_order, i.created_at limit 1) as product_image
  from reviews r join products p on p.id = r.product_id`;

const toPublic = (rows: (Omit<PublicReview, "date"> & { created_at: Date })[]): PublicReview[] =>
  rows.map(({ created_at, ...r }) => ({ ...r, product_image: r.product_image ?? "", date: new Date(created_at).toISOString() }));

/** Approved reviews for one product (cached; refreshed when reviews are moderated). */
export async function getProductReviews(productId: string): Promise<PublicReview[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("days");
  const rows = await sql<(Omit<PublicReview, "date"> & { created_at: Date })[]>`
    ${select} where r.product_id = ${productId} and r.status = 'approved' order by r.created_at desc limit 200`;
  return toPublic(rows);
}

/** Latest approved reviews across the whole store (the “Store reviews” tab). */
export async function getStoreReviews(): Promise<{ reviews: PublicReview[]; total: number }> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("days");
  const rows = await sql<(Omit<PublicReview, "date"> & { created_at: Date })[]>`
    ${select} where r.status = 'approved' and p.status = 'active' order by r.created_at desc limit 60`;
  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from reviews where status = 'approved'`;
  return { reviews: toPublic(rows), total: count };
}
