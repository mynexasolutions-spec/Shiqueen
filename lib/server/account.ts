import "server-only";
import { sql } from "./db";
import { requireUser } from "./session";
import { loadOrder } from "./admin/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/format";

/** Orders belong to a customer by account, or by their verified email (guest checkouts before sign-up). */
export async function getMyOrders(limit = 50) {
  const user = await requireUser();
  const rows = await sql<
    { id: string; order_number: string; total: number; status: OrderStatus; payment_status: PaymentStatus; payment_method: "prepaid" | "cod"; created_at: Date; item_count: number; first_image: string | null }[]
  >`
    select o.id, o.order_number, o.total, o.status, o.payment_status, o.payment_method, o.created_at,
           (select coalesce(sum(quantity), 0)::int from order_items i where i.order_id = o.id) as item_count,
           (select i.image_url from order_items i where i.order_id = o.id limit 1) as first_image
    from orders o
    where (o.user_id = ${user.id} or o.email = ${user.email})
      and not (o.payment_method = 'prepaid' and o.razorpay_order_id <> '' and o.payment_status in ('pending', 'failed'))
    order by o.created_at desc limit ${limit}`;
  return rows.map((r) => ({ ...r }));
}

export async function getMyOrder(id: string) {
  const user = await requireUser();
  return loadOrder(id, { userId: user.id, email: user.email });
}

export async function getMyAddresses() {
  const user = await requireUser();
  const rows = await sql<{ id: string; full_name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string; is_default: boolean }[]>`
    select id, full_name, phone, line1, line2, city, state, pincode, is_default
    from addresses where user_id = ${user.id} order by is_default desc, created_at`;
  return rows.map((r) => ({ ...r }));
}
