import "server-only";

import crypto from "crypto";
import Razorpay from "razorpay";

import { sql } from "./db";
import { getSettings } from "./settings";
import { sendAdminOrderNotification, sendOrderConfirmationEmail, type OrderEmailData } from "./email";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let cachedClient: Razorpay | null = null;
let cachedKeyPair = "";

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID?.trim() ?? "";
}

export function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!key_id || !key_secret) return null;

  const pair = `${key_id}:${key_secret}`;
  if (!cachedClient || cachedKeyPair !== pair) {
    cachedClient = new Razorpay({ key_id, key_secret });
    cachedKeyPair = pair;
  }
  return cachedClient;
}

function timingSafeHexEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verifies the Razorpay Checkout callback signature (`order_id|payment_id`). */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret || !razorpayOrderId || !razorpayPaymentId || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return timingSafeHexEqual(signature, expected);
}

/** Verifies the Razorpay Webhook `x-razorpay-signature` header against the raw body. */
export function verifyRazorpayWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeHexEqual(signature, expected);
}

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  total: number;
  payment_method: string;
  payment_status: string;
  razorpay_payment_id: string;
  shipping_address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export interface MarkPaidResult {
  found: boolean;
  transitioned: boolean;
  orderNumber?: string;
  razorpayPaymentId?: string;
  emailData?: OrderEmailData;
}

/**
 * Atomically marks a matching order as paid and confirmed (idempotent).
 * Safe when both the checkout verification action and the Razorpay webhook fire.
 */
export async function markOrderPaid(opts: {
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  source: "checkout" | "webhook";
}): Promise<MarkPaidResult> {
  const rzpOrderId = (opts.razorpayOrderId ?? "").trim();
  const rzpPaymentId = (opts.razorpayPaymentId ?? "").trim();
  const validOrderId = opts.orderId && UUID_RE.test(opts.orderId) ? opts.orderId : null;

  if (!rzpOrderId && !validOrderId) {
    return { found: false, transitioned: false };
  }

  const settings = await getSettings();

  return sql.begin(async (tx) => {
    const match =
      rzpOrderId && validOrderId
        ? sql`(razorpay_order_id = ${rzpOrderId} or id = ${validOrderId})`
        : rzpOrderId
          ? sql`razorpay_order_id = ${rzpOrderId}`
          : sql`id = ${validOrderId}`;

    const [updated] = await tx<OrderRow[]>`
      update orders
      set payment_status = 'paid',
          status = case when status = 'pending' then 'confirmed' else status end,
          razorpay_payment_id = case when ${rzpPaymentId} <> '' then ${rzpPaymentId} else razorpay_payment_id end,
          updated_at = now()
      where ${match} and payment_status <> 'paid'
      returning id, order_number, customer_name, email::text as email, total, payment_method,
                payment_status, razorpay_payment_id, shipping_address`;

    if (!updated) {
      // Either the order doesn't exist or it was already marked paid.
      const [existing] = await tx<{ id: string; order_number: string; payment_status: string; razorpay_payment_id: string }[]>`
        select id, order_number, payment_status, razorpay_payment_id
        from orders
        where ${match}
        limit 1`;
      if (!existing) return { found: false, transitioned: false };

      // Backfill razorpay_payment_id if webhook/verify arrived without it earlier.
      if (rzpPaymentId && !existing.razorpay_payment_id) {
        await tx`
          update orders
          set razorpay_payment_id = ${rzpPaymentId}, updated_at = now()
          where id = ${existing.id}`;
      }

      return {
        found: true,
        transitioned: false,
        orderNumber: existing.order_number,
        razorpayPaymentId: rzpPaymentId || existing.razorpay_payment_id,
      };
    }

    const note = rzpPaymentId
      ? `Payment verified via Razorpay (${rzpPaymentId}) [${opts.source}]`
      : `Payment verified via Razorpay [${opts.source}]`;

    await tx`
      insert into order_status_history (order_id, status, note, created_by)
      values (${updated.id}, 'confirmed', ${note}, null)`;

    const items = await tx<{ product_name: string; quantity: number; line_total: number; finish: string }[]>`
      select product_name, quantity, line_total, finish
      from order_items
      where order_id = ${updated.id}`;

    const addr = updated.shipping_address ?? {};
    const addressLine = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

    const emailData: OrderEmailData = {
      orderNumber: updated.order_number,
      customerName: updated.customer_name,
      email: updated.email,
      total: updated.total,
      paymentMethod: updated.payment_method,
      paymentLabel: `${settings.online_label} (Paid)`,
      items: items.map((i) => ({
        name: i.product_name,
        quantity: i.quantity,
        lineTotal: i.line_total,
        finish: i.finish,
      })),
      address: addressLine,
    };

    return {
      found: true,
      transitioned: true,
      orderNumber: updated.order_number,
      razorpayPaymentId: updated.razorpay_payment_id || rzpPaymentId,
      emailData,
    };
  });
}

/**
 * Records a payment failure only if the order is still pending (never overwrites a paid order).
 */
export async function markOrderPaymentFailed(opts: {
  orderId?: string;
  razorpayOrderId?: string;
  reason?: string;
}): Promise<boolean> {
  const rzpOrderId = (opts.razorpayOrderId ?? "").trim();
  const validOrderId = opts.orderId && UUID_RE.test(opts.orderId) ? opts.orderId : null;
  if (!rzpOrderId && !validOrderId) return false;

  const reason = (opts.reason ?? "Payment transaction failed").trim().slice(0, 300);

  return sql.begin(async (tx) => {
    const match =
      rzpOrderId && validOrderId
        ? sql`(razorpay_order_id = ${rzpOrderId} or id = ${validOrderId})`
        : rzpOrderId
          ? sql`razorpay_order_id = ${rzpOrderId}`
          : sql`id = ${validOrderId}`;

    const [updated] = await tx<{ id: string }[]>`
      update orders
      set payment_status = 'failed', updated_at = now()
      where ${match} and payment_status = 'pending'
      returning id`;

    if (!updated) return false;

    await tx`
      insert into order_status_history (order_id, status, note, created_by)
      values (${updated.id}, 'pending', ${`Razorpay payment failed: ${reason}`}, null)`;

    return true;
  });
}

export async function sendPaidOrderEmails(emailData: OrderEmailData): Promise<void> {
  const settings = await getSettings();
  await Promise.allSettled([
    sendOrderConfirmationEmail(emailData),
    sendAdminOrderNotification(settings.order_notification_email, emailData),
  ]);
}
