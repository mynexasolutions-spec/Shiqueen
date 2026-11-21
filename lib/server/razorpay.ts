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

export interface CheckoutIntentItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  finish: string;
  unitPrice: number;
  unitMrp: number;
  quantity: number;
  giftWrap: boolean;
  giftMessage: string;
  lineTotal: number;
}

interface CheckoutIntentRow {
  id: string;
  razorpay_order_id: string;
  user_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: {
    full_name?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  mrp_total: number;
  subtotal: number;
  gift_wrap_total: number;
  prepaid_discount: number;
  coupon_id: string | null;
  coupon_code: string;
  coupon_discount: number;
  shipping_fee: number;
  payment_fee: number;
  total: number;
  customer_notes: string;
  items: CheckoutIntentItem[];
  status: string;
  order_id: string | null;
  razorpay_payment_id: string;
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
 * Atomically finalizes a paid Razorpay checkout intent into a real order (idempotent).
 * Falls back to legacy pre-created orders if no checkout intent matches.
 * Safe when both the checkout verification action and the Razorpay webhook fire concurrently.
 */
export async function markOrderPaid(opts: {
  intentId?: string;
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  source: "checkout" | "webhook";
}): Promise<MarkPaidResult> {
  const rzpOrderId = (opts.razorpayOrderId ?? "").trim();
  const rzpPaymentId = (opts.razorpayPaymentId ?? "").trim();
  const validIntentId = opts.intentId && UUID_RE.test(opts.intentId) ? opts.intentId : null;
  const validOrderId = opts.orderId && UUID_RE.test(opts.orderId) ? opts.orderId : null;

  if (!rzpOrderId && !validIntentId && !validOrderId) {
    return { found: false, transitioned: false };
  }

  const settings = await getSettings();

  return sql.begin(async (tx) => {
    // 1. Check checkout_intents first (new flow: real order is only created upon payment success).
    if (rzpOrderId || validIntentId) {
      const intentMatch =
        rzpOrderId && validIntentId
          ? sql`(razorpay_order_id = ${rzpOrderId} or id = ${validIntentId})`
          : rzpOrderId
            ? sql`razorpay_order_id = ${rzpOrderId}`
            : sql`id = ${validIntentId}`;

      const [intent] = await tx<CheckoutIntentRow[]>`
        select id, razorpay_order_id, user_id, customer_name, email::text as email, phone,
               shipping_address, mrp_total, subtotal, gift_wrap_total, prepaid_discount,
               coupon_id, coupon_code, coupon_discount, shipping_fee, payment_fee, total,
               customer_notes, items, status, order_id, razorpay_payment_id
        from checkout_intents
        where ${intentMatch}
        limit 1
        for update`;

      if (intent) {
        // Already converted to an order by the other path (checkout verify or webhook).
        if (intent.order_id) {
          const [existingOrder] = await tx<{ id: string; order_number: string; razorpay_payment_id: string }[]>`
            select id, order_number, razorpay_payment_id
            from orders
            where id = ${intent.order_id}
            limit 1`;

          if (existingOrder) {
            if (rzpPaymentId && !existingOrder.razorpay_payment_id) {
              await tx`
                update orders
                set razorpay_payment_id = ${rzpPaymentId}, updated_at = now()
                where id = ${existingOrder.id}`;
            }
            if (rzpPaymentId && !intent.razorpay_payment_id) {
              await tx`
                update checkout_intents
                set razorpay_payment_id = ${rzpPaymentId}, updated_at = now()
                where id = ${intent.id}`;
            }
            return {
              found: true,
              transitioned: false,
              orderNumber: existingOrder.order_number,
              razorpayPaymentId: rzpPaymentId || existingOrder.razorpay_payment_id || intent.razorpay_payment_id,
            };
          }
        }

        const intentItems = Array.isArray(intent.items) ? intent.items : [];
        const addr = intent.shipping_address ?? {};

        // Create the real order as confirmed & paid.
        const [order] = await tx<{ id: string; order_number: string }[]>`
          insert into orders (
            user_id, customer_name, email, phone, shipping_address,
            mrp_total, subtotal, gift_wrap_total, prepaid_discount,
            coupon_code, coupon_discount, shipping_fee, payment_fee, total,
            payment_method, payment_status, status,
            razorpay_order_id, razorpay_payment_id, customer_notes
          )
          values (
            ${intent.user_id}, ${intent.customer_name}, ${intent.email}, ${intent.phone}, ${tx.json(addr)},
            ${intent.mrp_total}, ${intent.subtotal}, ${intent.gift_wrap_total}, ${intent.prepaid_discount},
            ${intent.coupon_code}, ${intent.coupon_discount}, ${intent.shipping_fee}, ${intent.payment_fee}, ${intent.total},
            'prepaid', 'paid', 'confirmed',
            ${intent.razorpay_order_id}, ${rzpPaymentId}, ${intent.customer_notes}
          )
          returning id, order_number`;

        for (const l of intentItems) {
          await tx`
            insert into order_items (
              order_id, product_id, product_name, product_slug, product_sku,
              image_url, finish, unit_price, unit_mrp, quantity, gift_wrap, gift_message, line_total
            )
            values (
              ${order.id}, ${l.productId || null}, ${l.name}, ${l.slug}, ${l.sku ?? ""},
              ${l.image ?? ""}, ${l.finish ?? ""}, ${l.unitPrice}, ${l.unitMrp ?? 0},
              ${l.quantity}, ${Boolean(l.giftWrap)}, ${l.giftMessage ?? ""}, ${l.lineTotal}
            )`;
        }

        // Deduct stock now that payment has succeeded (never fail a paid order on stock race).
        const perProduct = new Map<string, number>();
        for (const l of intentItems) {
          if (!l.productId) continue;
          perProduct.set(l.productId, (perProduct.get(l.productId) ?? 0) + l.quantity);
        }
        for (const [productId, qty] of perProduct) {
          await tx`
            update products
            set stock = greatest(0, stock - ${qty}), updated_at = now()
            where id = ${productId} and track_inventory`;
        }

        // Record coupon usage now that payment has succeeded.
        if (intent.coupon_id) {
          await tx`
            update coupons
            set used_count = used_count + 1
            where id = ${intent.coupon_id}`;
        } else if (intent.coupon_code) {
          await tx`
            update coupons
            set used_count = used_count + 1
            where code = ${intent.coupon_code}`;
        }

        const note = rzpPaymentId
          ? `Order placed & payment verified via Razorpay (${rzpPaymentId}) [${opts.source}]`
          : `Order placed & payment verified via Razorpay [${opts.source}]`;

        await tx`
          insert into order_status_history (order_id, status, note, created_by)
          values (${order.id}, 'confirmed', ${note}, ${intent.user_id})`;

        // Save default address & phone for signed-in customers if they don't have one yet.
        if (intent.user_id) {
          const [{ count }] = await tx<{ count: number }[]>`
            select count(*)::int as count from addresses where user_id = ${intent.user_id}`;
          if (count === 0 && addr.line1 && addr.city && addr.state && addr.pincode) {
            await tx`
              insert into addresses (user_id, full_name, phone, line1, city, state, pincode, is_default)
              values (${intent.user_id}, ${addr.full_name || intent.customer_name}, ${addr.phone || intent.phone},
                      ${addr.line1}, ${addr.city}, ${addr.state}, ${addr.pincode}, true)`;
          }
          await tx`
            update users set phone = ${intent.phone}
            where id = ${intent.user_id} and (phone is null or phone = '')`;
        }

        await tx`
          update checkout_intents
          set status = 'completed',
              order_id = ${order.id},
              razorpay_payment_id = case when ${rzpPaymentId} <> '' then ${rzpPaymentId} else razorpay_payment_id end,
              updated_at = now()
          where id = ${intent.id}`;

        const addressLine = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
        const emailData: OrderEmailData = {
          orderNumber: order.order_number,
          customerName: intent.customer_name,
          email: intent.email,
          total: intent.total,
          paymentMethod: "prepaid",
          paymentLabel: `${settings.online_label} (Paid)`,
          items: intentItems.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            lineTotal: i.lineTotal,
            finish: i.finish,
          })),
          address: addressLine,
        };

        return {
          found: true,
          transitioned: true,
          orderNumber: order.order_number,
          razorpayPaymentId: rzpPaymentId || intent.razorpay_payment_id,
          emailData,
        };
      }
    }

    // 2. Fallback for any legacy pre-created order still in flight.
    if (!rzpOrderId && !validOrderId) {
      return { found: false, transitioned: false };
    }

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
      const [existing] = await tx<{ id: string; order_number: string; payment_status: string; razorpay_payment_id: string }[]>`
        select id, order_number, payment_status, razorpay_payment_id
        from orders
        where ${match}
        limit 1`;
      if (!existing) return { found: false, transitioned: false };

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
 * Records a payment failure on a pending checkout intent (never creates an order).
 * Falls back to legacy orders only if no checkout intent matches.
 */
export async function markOrderPaymentFailed(opts: {
  intentId?: string;
  orderId?: string;
  razorpayOrderId?: string;
  reason?: string;
}): Promise<boolean> {
  const rzpOrderId = (opts.razorpayOrderId ?? "").trim();
  const validIntentId = opts.intentId && UUID_RE.test(opts.intentId) ? opts.intentId : null;
  const validOrderId = opts.orderId && UUID_RE.test(opts.orderId) ? opts.orderId : null;
  if (!rzpOrderId && !validIntentId && !validOrderId) return false;

  const reason = (opts.reason ?? "Payment transaction failed").trim().slice(0, 300);

  return sql.begin(async (tx) => {
    if (rzpOrderId || validIntentId) {
      const intentMatch =
        rzpOrderId && validIntentId
          ? sql`(razorpay_order_id = ${rzpOrderId} or id = ${validIntentId})`
          : rzpOrderId
            ? sql`razorpay_order_id = ${rzpOrderId}`
            : sql`id = ${validIntentId}`;

      const [updatedIntent] = await tx<{ id: string }[]>`
        update checkout_intents
        set status = 'failed', failure_reason = ${reason}, updated_at = now()
        where ${intentMatch} and status = 'pending' and order_id is null
        returning id`;

      if (updatedIntent) return true;

      // If an intent exists (even if already completed/failed/cancelled), do not touch orders.
      const [existingIntent] = await tx<{ id: string }[]>`
        select id from checkout_intents where ${intentMatch} limit 1`;
      if (existingIntent) return false;
    }

    if (!rzpOrderId && !validOrderId) return false;

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
