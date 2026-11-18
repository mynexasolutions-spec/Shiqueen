import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";

const PAGE_SIZE = 20;

export interface AdminReview {
  id: string;
  author_name: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "hidden";
  is_featured: boolean;
  verified_purchase: boolean;
  admin_reply: string;
  created_at: Date;
  product_id: string;
  product_name: string;
  product_slug: string;
  user_id: string | null;
  user_email: string | null;
}

export async function listReviewsAdmin(opts: { status?: string; q?: string; page?: number }) {
  await requireAdmin();
  const page = Math.max(1, Math.floor(opts.page ?? 1) || 1);
  const status = ["pending", "approved", "hidden", "featured"].includes(opts.status ?? "") ? opts.status! : "";
  const q = (opts.q ?? "").trim().slice(0, 100);
  const like = `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
  const where = sql`
    where true
    ${status === "featured" ? sql`and r.is_featured` : status ? sql`and r.status = ${status}` : sql``}
    ${q ? sql`and (p.name ilike ${like} or r.author_name ilike ${like} or r.body ilike ${like})` : sql``}`;

  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count from reviews r join products p on p.id = r.product_id ${where}`;
  const items = await sql<AdminReview[]>`
    select r.id, r.author_name, r.location, r.rating, r.title, r.body, r.status, r.is_featured, r.verified_purchase,
           r.admin_reply, r.created_at, p.id as product_id, p.name as product_name, p.slug as product_slug,
           r.user_id, u.email::text as user_email
    from reviews r join products p on p.id = r.product_id left join users u on u.id = r.user_id
    ${where}
    order by (r.status = 'pending') desc, r.created_at desc
    limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`;
  const [counts] = await sql<{ pending: number; approved: number; hidden: number; featured: number }[]>`
    select count(*) filter (where status = 'pending')::int as pending,
           count(*) filter (where status = 'approved')::int as approved,
           count(*) filter (where status = 'hidden')::int as hidden,
           count(*) filter (where is_featured)::int as featured
    from reviews`;
  return { items: items.map((i) => ({ ...i })), total: count, page, totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)), counts: { ...counts } };
}

export async function pendingReviewCount() {
  await requireAdmin();
  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from reviews where status = 'pending'`;
  return count;
}
