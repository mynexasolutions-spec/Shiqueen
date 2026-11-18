"use server";

import { after } from "next/server";
import { refresh } from "next/cache";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { refreshStorefront } from "@/lib/server/revalidate";
import { isUuid } from "@/lib/server/admin/categories";
import { sendOrderStatusEmail } from "@/lib/server/email";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_STATUSES, PAYMENT_STATUS_LABEL, type OrderStatus, type PaymentStatus } from "@/lib/format";

export interface FormState {
  error?: string;
  message?: string;
}

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);
const RELEASES_STOCK: OrderStatus[] = ["cancelled", "returned"];

export async function updateOrderStatusAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = str(fd, "id", 40);
  const status = str(fd, "status", 20) as OrderStatus;
  const note = str(fd, "note", 500);
  const notify = fd.get("notify") === "on";
  if (!isUuid(id)) return { error: "Invalid order." };
  if (!ORDER_STATUSES.includes(status)) return { error: "Please choose a valid status." };

  let restocked = false;
  let order: { email: string; customer_name: string; order_number: string; courier: string; tracking_number: string; tracking_url: string } | undefined;

  try {
    await sql.begin(async (tx) => {
      const [current] = await tx<{ status: OrderStatus }[]>`select status from orders where id = ${id} for update`;
      if (!current) throw new Error("NOT_FOUND");
      if (current.status === status) throw new Error("SAME");
      if (RELEASES_STOCK.includes(current.status)) throw new Error("FINAL");

      [order] = await tx<NonNullable<typeof order>[]>`
        update orders set status = ${status}, updated_at = now() where id = ${id}
        returning email::text as email, customer_name, order_number, courier, tracking_number, tracking_url`;
      await tx`insert into order_status_history (order_id, status, note, created_by) values (${id}, ${status}, ${note}, ${admin.id})`;

      // Put items back on the shelf when an order is cancelled or returned.
      if (RELEASES_STOCK.includes(status)) {
        await tx`
          update products p set stock = p.stock + i.qty, updated_at = now()
          from (select product_id, sum(quantity)::int as qty from order_items where order_id = ${id} and product_id is not null group by product_id) i
          where p.id = i.product_id and p.track_inventory`;
        restocked = true;
      }
    });
  } catch (err) {
    const msg = (err as Error).message;
    if (msg === "NOT_FOUND") return { error: "Order not found." };
    if (msg === "SAME") return { error: `The order is already ${ORDER_STATUS_LABEL[status].toLowerCase()}.` };
    if (msg === "FINAL") return { error: "Cancelled or returned orders can't be changed. Create a new order instead." };
    console.error("[admin] updateOrderStatus", err);
    return { error: "Could not update the order. Please try again." };
  }

  if (restocked) refreshStorefront();
  if (notify && order?.email) {
    const o = order;
    after(() =>
      sendOrderStatusEmail({
        email: o.email,
        name: o.customer_name,
        orderNumber: o.order_number,
        status,
        courier: o.courier,
        trackingNumber: o.tracking_number,
        trackingUrl: o.tracking_url,
      })
    );
  }
  refresh();
  return { message: `Status changed to ${ORDER_STATUS_LABEL[status]}${restocked ? " — items returned to stock" : ""}${notify && order?.email ? " — customer emailed" : ""}.` };
}

export async function updatePaymentStatusAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = str(fd, "id", 40);
  const payment = str(fd, "payment_status", 20) as PaymentStatus;
  if (!isUuid(id)) return { error: "Invalid order." };
  if (!PAYMENT_STATUSES.includes(payment)) return { error: "Please choose a valid payment status." };
  const updated = await sql`update orders set payment_status = ${payment}, updated_at = now() where id = ${id} returning id`;
  if (!updated.length) return { error: "Order not found." };
  await sql`insert into order_status_history (order_id, status, note, created_by)
            values (${id}, ${"payment:" + payment}, ${"Payment marked " + PAYMENT_STATUS_LABEL[payment].toLowerCase()}, ${admin.id})`;
  refresh();
  return { message: `Payment marked as ${PAYMENT_STATUS_LABEL[payment].toLowerCase()}.` };
}

export async function updateShippingAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  if (!isUuid(id)) return { error: "Invalid order." };
  const trackingUrl = str(fd, "tracking_url", 500);
  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) return { error: "Tracking link must start with https://" };
  const updated = await sql`
    update orders set courier = ${str(fd, "courier", 80)}, tracking_number = ${str(fd, "tracking_number", 120)},
                      tracking_url = ${trackingUrl}, updated_at = now()
    where id = ${id} returning id`;
  if (!updated.length) return { error: "Order not found." };
  refresh();
  return { message: "Shipping details saved." };
}

export async function updateAdminNotesAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  if (!isUuid(id)) return { error: "Invalid order." };
  await sql`update orders set admin_notes = ${str(fd, "admin_notes", 3000)}, updated_at = now() where id = ${id}`;
  refresh();
  return { message: "Notes saved." };
}
