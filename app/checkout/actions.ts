"use server";

import { after } from "next/server";

import { sql } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";
import { getSettings } from "@/lib/server/settings";
import { quoteCart, sanitizeCart, type Quote } from "@/lib/server/pricing";
import { sendAdminOrderNotification, sendOrderConfirmationEmail } from "@/lib/server/email";
import { refreshStorefront } from "@/lib/server/revalidate";
import {
  getRazorpayClient,
  getRazorpayKeyId,
  isRazorpayConfigured,
  markOrderPaid,
  sendPaidOrderEmails,
  verifyRazorpaySignature,
} from "@/lib/server/razorpay";

export interface CheckoutContext {
  user: { name: string; email: string; phone: string } | null;
  address: { full_name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string } | null;
  settings: {
    prepaidDiscountPercent: number;
    giftWrapPrice: number;
    shippingFee: number;
    freeShippingThreshold: number;
    codEnabled: boolean;
    codLabel: string;
    codDescription: string;
    codFee: number;
    codMaxOrder: number;
    onlineEnabled: boolean;
    onlineLabel: string;
    onlineDescription: string;
    onlineFee: number;
    onlineInstructions: string;
    razorpayEnabled: boolean;
  };
}

/** Prefill data for the checkout form (signed-in customer + their default address). */
export async function getCheckoutContext(): Promise<CheckoutContext> {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);
  let address: CheckoutContext["address"] = null;
  if (user) {
    const [a] = await sql<NonNullable<CheckoutContext["address"]>[]>`
      select full_name, phone, line1, line2, city, state, pincode
      from addresses where user_id = ${user.id} order by is_default desc, created_at desc limit 1`;
    address = a ? { ...a } : null;
  }
  return {
    user: user ? { name: user.name, email: user.email, phone: user.phone } : null,
    address,
    settings: {
      prepaidDiscountPercent: settings.prepaid_discount_percent,
      giftWrapPrice: settings.gift_wrap_price,
      shippingFee: settings.shipping_fee,
      freeShippingThreshold: settings.free_shipping_threshold,
      codEnabled: settings.cod_enabled,
      codLabel: settings.cod_label,
      codDescription: settings.cod_description,
      codFee: settings.cod_fee,
      codMaxOrder: settings.cod_max_order,
      onlineEnabled: settings.online_enabled,
      onlineLabel: settings.online_label,
      onlineDescription: settings.online_description,
      onlineFee: settings.online_fee,
      onlineInstructions: settings.online_instructions,
      razorpayEnabled: isRazorpayConfigured(),
    },
  };
}

export type PublicQuote = Omit<Quote, "couponId" | "lines"> & {
  lines: { slug: string; name: string; quantity: number; unitPrice: number; lineTotal: number }[];
};

function toPublic(q: Quote): PublicQuote {
  const { lines, ...rest } = q;
  delete (rest as Partial<Quote>).couponId; // internal id stays on the server
  return { ...rest, lines: lines.map((l) => ({ slug: l.slug, name: l.name, quantity: l.quantity, unitPrice: l.unitPrice, lineTotal: l.lineTotal })) };
}

/** Server-side price check for the current bag (prices, stock, coupon). */
export async function quoteCheckout(rawItems: unknown, couponCode: string, paymentMethod: "prepaid" | "cod"): Promise<PublicQuote> {
  const settings = await getSettings();
  const pm = paymentMethod === "cod" ? "cod" : "prepaid";
  return toPublic(await quoteCart(sanitizeCart(rawItems), String(couponCode ?? ""), pm, settings));
}

export interface PlaceOrderInput {
  items: unknown;
  couponCode: string;
  paymentMethod: "prepaid" | "cod";
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export type PlaceOrderResult =
  | {
      ok: true;
      isRazorpay: false;
      orderNumber: string;
      total: number;
      paymentMethod: "prepaid" | "cod";
      instructions: string;
    }
  | {
      ok: true;
      isRazorpay: true;
      orderId: string;
      orderNumber: string;
      total: number;
      paymentMethod: "prepaid";
      razorpayOrderId: string;
      razorpayKeyId: string;
      amount: number;
    }
  | { ok: false; error: string; issues?: string[] };

class CheckoutError extends Error {}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const user = await getCurrentUser();
  const settings = await getSettings();

  const fullName = String(input.fullName ?? "").trim().slice(0, 100);
  const phone = String(input.phone ?? "").replace(/[\s-]/g, "").slice(0, 15);
  const email = (String(input.email ?? "").trim().toLowerCase() || user?.email || "").slice(0, 200);
  const line1 = String(input.address ?? "").trim().slice(0, 300);
  const city = String(input.city ?? "").trim().slice(0, 80);
  const state = String(input.state ?? "").trim().slice(0, 80);
  const pincode = String(input.pincode ?? "").trim();
  const notes = String(input.notes ?? "").trim().slice(0, 500);
  const paymentMethod = input.paymentMethod === "cod" ? "cod" : "prepaid";

  if (!fullName) return { ok: false, error: "Please enter your full name." };
  if (!/^(\+?91)?[6-9]\d{9}$/.test(phone)) return { ok: false, error: "Please enter a valid 10-digit mobile number." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!line1 || !city || !state) return { ok: false, error: "Please complete your delivery address." };
  if (!/^\d{6}$/.test(pincode)) return { ok: false, error: "Please enter a valid 6-digit pincode." };
  if (paymentMethod === "cod" && !settings.cod_enabled) return { ok: false, error: "Cash on Delivery is currently unavailable." };
  if (paymentMethod === "prepaid" && !settings.online_enabled) return { ok: false, error: "Online payment is currently unavailable. Please choose another method." };

  const cart = sanitizeCart(input.items);
  if (!cart.length) return { ok: false, error: "Your bag is empty." };

  try {
    const result = await sql.begin(async (tx) => {
      const quote = await quoteCart(cart, String(input.couponCode ?? ""), paymentMethod, settings, tx);
      if (quote.issues.length) throw Object.assign(new CheckoutError("Some items in your bag need attention."), { issues: quote.issues });
      if (!quote.lines.length) throw new CheckoutError("Your bag is empty.");
      if (input.couponCode?.trim() && !quote.couponId) throw new CheckoutError(quote.couponMessage || "This coupon can't be applied.");
      if (paymentMethod === "cod" && !quote.codAvailable)
        throw new CheckoutError(`Cash on Delivery is available for orders up to ₹${settings.cod_max_order.toLocaleString("en-IN")}. Please choose online payment.`);

      // Reserve stock atomically.
      const perProduct = new Map<string, { qty: number; name: string }>();
      for (const l of quote.lines) {
        const cur = perProduct.get(l.productId);
        perProduct.set(l.productId, { qty: (cur?.qty ?? 0) + l.quantity, name: l.name });
      }
      for (const [productId, { qty, name }] of perProduct) {
        const updated = await tx`
          update products set stock = stock - ${qty}, updated_at = now()
          where id = ${productId} and (not track_inventory or stock >= ${qty})
          returning id`;
        if (!updated.length) throw new CheckoutError(`Sorry, "${name}" just went out of stock.`);
      }

      if (quote.couponId) {
        const used = await tx`
          update coupons set used_count = used_count + 1
          where id = ${quote.couponId} and (usage_limit is null or used_count < usage_limit) returning id`;
        if (!used.length) throw new CheckoutError("This coupon has reached its usage limit.");
      }

      const shippingAddress = { full_name: fullName, phone, line1, line2: "", city, state, pincode };
      const [order] = await tx<{ id: string; order_number: string }[]>`
        insert into orders (user_id, customer_name, email, phone, shipping_address, mrp_total, subtotal, gift_wrap_total,
                            prepaid_discount, coupon_code, coupon_discount, shipping_fee, payment_fee, total, payment_method, customer_notes)
        values (${user?.id ?? null}, ${fullName}, ${email}, ${phone}, ${tx.json(shippingAddress)}, ${quote.mrpTotal}, ${quote.subtotal},
                ${quote.giftWrapTotal}, ${quote.prepaidDiscount}, ${quote.couponCode}, ${quote.couponDiscount}, ${quote.shippingFee},
                ${quote.paymentFee}, ${quote.total}, ${paymentMethod}, ${notes})
        returning id, order_number`;

      for (const l of quote.lines) {
        await tx`
          insert into order_items (order_id, product_id, product_name, product_slug, product_sku, image_url, finish, unit_price, unit_mrp,
                                   quantity, gift_wrap, gift_message, line_total)
          values (${order.id}, ${l.productId}, ${l.name}, ${l.slug}, ${l.sku}, ${l.image}, ${l.finish}, ${l.unitPrice}, ${l.unitMrp},
                  ${l.quantity}, ${l.giftWrap}, ${l.giftMessage}, ${l.lineTotal})`;
      }
      await tx`insert into order_status_history (order_id, status, note, created_by) values (${order.id}, 'pending', 'Order placed', ${user?.id ?? null})`;

      // Remember the address for signed-in customers who don't have one yet.
      if (user) {
        const [{ count }] = await tx<{ count: number }[]>`select count(*)::int as count from addresses where user_id = ${user.id}`;
        if (count === 0) {
          await tx`insert into addresses (user_id, full_name, phone, line1, city, state, pincode, is_default)
                   values (${user.id}, ${fullName}, ${phone}, ${line1}, ${city}, ${state}, ${pincode}, true)`;
        }
        if (!user.phone) await tx`update users set phone = ${phone} where id = ${user.id}`;
      }

      return { orderId: order.id, orderNumber: order.order_number, quote };
    });

    // Stock levels changed → refresh storefront availability.
    refreshStorefront();

    if (paymentMethod === "prepaid" && result.quote.total > 0) {
      const razorpay = getRazorpayClient();
      if (razorpay) {
        try {
          const rzpOrder = await razorpay.orders.create({
            amount: Math.round(result.quote.total * 100),
            currency: "INR",
            receipt: result.orderNumber,
            notes: {
              internal_order_id: result.orderId,
              order_number: result.orderNumber,
            },
          });

          await sql`
            update orders
            set razorpay_order_id = ${rzpOrder.id}, updated_at = now()
            where id = ${result.orderId}`;

          return {
            ok: true,
            isRazorpay: true,
            orderId: result.orderId,
            orderNumber: result.orderNumber,
            total: result.quote.total,
            paymentMethod: "prepaid",
            razorpayOrderId: rzpOrder.id,
            razorpayKeyId: getRazorpayKeyId(),
            amount: Number(rzpOrder.amount),
          };
        } catch (err) {
          console.error("[checkout] Razorpay order creation failed", err);
          // Roll back reserved stock/coupon and cancel the uninitiated order.
          await sql.begin(async (tx) => {
            for (const l of result.quote.lines) {
              await tx`
                update products
                set stock = stock + ${l.quantity}, updated_at = now()
                where id = ${l.productId} and track_inventory`;
            }
            if (result.quote.couponId) {
              await tx`
                update coupons
                set used_count = greatest(0, used_count - 1)
                where id = ${result.quote.couponId}`;
            }
            await tx`
              update orders
              set status = 'cancelled', payment_status = 'failed', updated_at = now()
              where id = ${result.orderId}`;
            await tx`
              insert into order_status_history (order_id, status, note, created_by)
              values (${result.orderId}, 'cancelled', 'Razorpay order initialization failed', ${user?.id ?? null})`;
          }).catch((rollbackErr) => console.error("[checkout] rollback failed", rollbackErr));

          refreshStorefront();
          return {
            ok: false,
            error: "Could not start online payment right now. Please try again in a moment.",
          };
        }
      }
    }

    const emailData = {
      paymentLabel: paymentMethod === "cod" ? settings.cod_label : settings.online_label,
      instructions: paymentMethod === "prepaid" ? settings.online_instructions : "",
      orderNumber: result.orderNumber,
      customerName: fullName,
      email,
      total: result.quote.total,
      paymentMethod,
      items: result.quote.lines.map((l) => ({ name: l.name, quantity: l.quantity, lineTotal: l.lineTotal, finish: l.finish })),
      address: `${line1}, ${city}, ${state} ${pincode}`,
    };
    after(async () => {
      await sendOrderConfirmationEmail(emailData);
      await sendAdminOrderNotification(settings.order_notification_email, emailData);
    });

    return {
      ok: true,
      isRazorpay: false,
      orderNumber: result.orderNumber,
      total: result.quote.total,
      paymentMethod,
      instructions: paymentMethod === "prepaid" ? settings.online_instructions : "",
    };
  } catch (err) {
    if (err instanceof CheckoutError) {
      return { ok: false, error: err.message, issues: (err as CheckoutError & { issues?: string[] }).issues };
    }
    console.error("[checkout] placeOrder failed", err);
    return { ok: false, error: "Something went wrong while placing your order. Please try again." };
  }
}

export interface VerifyRazorpayPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}

export type VerifyRazorpayPaymentResult =
  | { ok: true; orderNumber: string; razorpayPaymentId: string }
  | { ok: false; error: string };

export async function verifyRazorpayPayment(
  input: VerifyRazorpayPaymentInput
): Promise<VerifyRazorpayPaymentResult> {
  const razorpayOrderId = String(input.razorpayOrderId ?? "").trim();
  const razorpayPaymentId = String(input.razorpayPaymentId ?? "").trim();
  const razorpaySignature = String(input.razorpaySignature ?? "").trim();
  const orderId = String(input.orderId ?? "").trim();

  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return { ok: false, error: "Payment signature verification failed." };
  }

  try {
    const res = await markOrderPaid({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      source: "checkout",
    });

    if (!res.found || !res.orderNumber) {
      return { ok: false, error: "Order not found for this payment." };
    }

    if (res.transitioned && res.emailData) {
      const emailData = res.emailData;
      after(async () => {
        await sendPaidOrderEmails(emailData);
      });
    }

    return {
      ok: true,
      orderNumber: res.orderNumber,
      razorpayPaymentId: res.razorpayPaymentId || razorpayPaymentId,
    };
  } catch (err) {
    console.error("[checkout] verifyRazorpayPayment failed", err);
    return { ok: false, error: "Payment was received, but we could not verify it right now. Please contact support with your payment ID." };
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Cancels an unpaid pending Razorpay order (e.g. if the customer edits their cart/address
 * or switches to COD after dismissing the payment popup) and restores reserved stock & coupon.
 */
export async function cancelUnpaidRazorpayOrder(input: {
  orderId: string;
  razorpayOrderId: string;
}): Promise<{ cancelled: boolean }> {
  const orderId = String(input.orderId ?? "").trim();
  const razorpayOrderId = String(input.razorpayOrderId ?? "").trim();
  if (!UUID_RE.test(orderId) || !razorpayOrderId) return { cancelled: false };

  const user = await getCurrentUser();
  let cancelled = false;

  try {
    await sql.begin(async (tx) => {
      const [order] = await tx<{
        id: string;
        status: string;
        payment_status: string;
        payment_method: string;
        coupon_code: string;
      }[]>`
        select id, status, payment_status, payment_method, coupon_code
        from orders
        where id = ${orderId} and razorpay_order_id = ${razorpayOrderId} and razorpay_order_id <> ''
        for update`;

      if (!order) return;
      if (order.status !== "pending" || order.payment_method !== "prepaid") return;
      if (order.payment_status !== "pending" && order.payment_status !== "failed") return;

      await tx`
        update orders
        set status = 'cancelled', updated_at = now()
        where id = ${order.id}`;

      await tx`
        update products p
        set stock = p.stock + i.qty, updated_at = now()
        from (
          select product_id, sum(quantity)::int as qty
          from order_items
          where order_id = ${order.id} and product_id is not null
          group by product_id
        ) i
        where p.id = i.product_id and p.track_inventory`;

      if (order.coupon_code) {
        await tx`
          update coupons
          set used_count = greatest(0, used_count - 1)
          where code = ${order.coupon_code}`;
      }

      await tx`
        insert into order_status_history (order_id, status, note, created_by)
        values (${order.id}, 'cancelled', 'Cancelled before payment (checkout updated by customer)', ${user?.id ?? null})`;

      cancelled = true;
    });
  } catch (err) {
    console.error("[checkout] cancelUnpaidRazorpayOrder failed", err);
    return { cancelled: false };
  }

  if (cancelled) refreshStorefront();
  return { cancelled };
}
