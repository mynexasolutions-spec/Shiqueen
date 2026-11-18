import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";
import { isUuid } from "./categories";
import { ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from "@/lib/format";

const PAGE_SIZE = 20;

export interface OrderListItem {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: "prepaid" | "cod";
  item_count: number;
  created_at: Date;
}

export async function listOrdersAdmin(opts: { q?: string; status?: string; payment?: string; page?: number; userId?: string }) {
  await requireAdmin();
  const page = Math.max(1, Math.floor(opts.page ?? 1) || 1);
  const q = (opts.q ?? "").trim().slice(0, 100);
  const status = (ORDER_STATUSES as readonly string[]).includes(opts.status ?? "") ? opts.status! : "";
  const payment = (PAYMENT_STATUSES as readonly string[]).includes(opts.payment ?? "") ? opts.payment! : "";
  const like = `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;

  const where = sql`
    where true
    ${q ? sql`and (o.order_number ilike ${like} or o.customer_name ilike ${like} or o.email::text ilike ${like} or o.phone ilike ${like})` : sql``}
    ${status ? sql`and o.status = ${status}` : sql``}
    ${payment ? sql`and o.payment_status = ${payment}` : sql``}
    ${isUuid(opts.userId) ? sql`and o.user_id = ${opts.userId}` : sql``}
  `;
  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from orders o ${where}`;
  const items = await sql<OrderListItem[]>`
    select o.id, o.order_number, o.customer_name, o.email::text as email, o.phone, o.total, o.status, o.payment_status,
           o.payment_method, o.created_at,
           (select coalesce(sum(quantity), 0)::int from order_items i where i.order_id = o.id) as item_count
    from orders o ${where}
    order by o.created_at desc
    limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`;
  return { items: items.map((i) => ({ ...i })), total: count, page, totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)) };
}

export interface OrderDetail extends OrderListItem {
  user_id: string | null;
  shipping_address: { full_name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };
  mrp_total: number;
  subtotal: number;
  gift_wrap_total: number;
  prepaid_discount: number;
  coupon_code: string;
  coupon_discount: number;
  shipping_fee: number;
  payment_fee: number;
  courier: string;
  tracking_number: string;
  tracking_url: string;
  customer_notes: string;
  admin_notes: string;
  updated_at: Date;
  items: {
    id: string;
    product_id: string | null;
    product_name: string;
    product_slug: string;
    image_url: string;
    finish: string;
    unit_price: number;
    unit_mrp: number;
    quantity: number;
    gift_wrap: boolean;
    gift_message: string;
    line_total: number;
  }[];
  history: { id: string; status: string; note: string; created_at: Date; by_name: string | null }[];
}

export async function getOrderAdmin(id: string): Promise<OrderDetail | null> {
  await requireAdmin();
  return loadOrder(id);
}

/** Shared loader (callers must authorise first). */
export async function loadOrder(id: string, ownerFilter?: { userId: string; email: string }): Promise<OrderDetail | null> {
  if (!isUuid(id)) return null;
  const [o] = await sql<Omit<OrderDetail, "items" | "history" | "item_count">[]>`
    select id, order_number, user_id, customer_name, email::text as email, phone, shipping_address, mrp_total, subtotal,
           gift_wrap_total, prepaid_discount, coupon_code, coupon_discount, shipping_fee, payment_fee, total, payment_method,
           payment_status, status, courier, tracking_number, tracking_url, customer_notes, admin_notes, created_at, updated_at
    from orders where id = ${id}
    ${ownerFilter ? sql`and (user_id = ${ownerFilter.userId} or (email = ${ownerFilter.email} and ${ownerFilter.email} <> ''))` : sql``}`;
  if (!o) return null;
  const items = await sql<OrderDetail["items"]>`
    select id, product_id, product_name, product_slug, image_url, finish, unit_price, unit_mrp, quantity, gift_wrap, gift_message, line_total
    from order_items where order_id = ${id} order by product_name`;
  const history = await sql<OrderDetail["history"]>`
    select h.id, h.status, h.note, h.created_at, u.name as by_name
    from order_status_history h left join users u on u.id = h.created_by
    where h.order_id = ${id} order by h.created_at desc`;
  return {
    ...o,
    item_count: items.reduce((s, i) => s + i.quantity, 0),
    items: items.map((i) => ({ ...i })),
    history: history.map((h) => ({ ...h })),
  };
}
