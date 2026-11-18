import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";
import { isUuid } from "./categories";

const PAGE_SIZE = 25;

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  is_active: boolean;
  verified: boolean;
  order_count: number;
  total_spent: number;
  created_at: Date;
  last_login_at: Date | null;
}

const statsSelect = sql`
  (select count(*)::int from orders o where o.user_id = u.id) as order_count,
  (select coalesce(sum(o.total), 0)::int from orders o where o.user_id = u.id and o.status not in ('cancelled', 'returned')) as total_spent`;

export async function listCustomersAdmin(opts: { q?: string; role?: string; page?: number }) {
  await requireAdmin();
  const page = Math.max(1, Math.floor(opts.page ?? 1) || 1);
  const q = (opts.q ?? "").trim().slice(0, 100);
  const role = opts.role === "admin" || opts.role === "customer" ? opts.role : "";
  const like = `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
  const where = sql`
    where true
    ${q ? sql`and (u.name ilike ${like} or u.email::text ilike ${like} or u.phone ilike ${like})` : sql``}
    ${role ? sql`and u.role = ${role}` : sql``}`;

  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from users u ${where}`;
  const items = await sql<CustomerListItem[]>`
    select u.id, u.name, u.email::text as email, u.phone, u.role, u.is_active, (u.email_verified_at is not null) as verified,
           u.created_at, u.last_login_at, ${statsSelect}
    from users u ${where}
    order by u.created_at desc
    limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`;
  return { items: items.map((i) => ({ ...i })), total: count, page, totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)) };
}

export async function getCustomerAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  const [user] = await sql<CustomerListItem[]>`
    select u.id, u.name, u.email::text as email, u.phone, u.role, u.is_active, (u.email_verified_at is not null) as verified,
           u.created_at, u.last_login_at, ${statsSelect}
    from users u where u.id = ${id}`;
  if (!user) return null;
  const addresses = await sql<{ id: string; full_name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string; is_default: boolean }[]>`
    select id, full_name, phone, line1, line2, city, state, pincode, is_default from addresses where user_id = ${id} order by is_default desc, created_at`;
  return { ...user, addresses: addresses.map((a) => ({ ...a })) };
}
