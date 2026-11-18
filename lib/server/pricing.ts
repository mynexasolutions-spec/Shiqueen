import "server-only";
import type postgres from "postgres";
import { sql as defaultSql } from "./db";
import type { StoreSettings } from "@/lib/settings-defaults";

export interface CartLineInput {
  slug: string;
  quantity: number;
  finish: string;
  giftWrap: boolean;
  giftMessage: string;
}

export interface PricedLine extends CartLineInput {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  unitMrp: number;
  lineTotal: number;
}

export interface Quote {
  lines: PricedLine[];
  issues: string[];
  totalItems: number;
  mrpTotal: number;
  subtotal: number;
  giftWrapTotal: number;
  prepaidDiscount: number;
  couponCode: string;
  couponDiscount: number;
  couponMessage: string;
  shippingFee: number;
  paymentFee: number;
  codAvailable: boolean;
  total: number;
  couponId: string | null;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  compare_at_price: number;
  stock: number;
  track_inventory: boolean;
  image: string | null;
}

interface CouponRow {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_subtotal: number;
  min_items: number;
  max_discount: number | null;
  usable: boolean;
  not_started: boolean;
  expired: boolean;
  limit_reached: boolean;
}

/** Normalises untrusted cart input from the browser. */
export function sanitizeCart(raw: unknown): CartLineInput[] {
  if (!Array.isArray(raw)) return [];
  const lines: CartLineInput[] = [];
  for (const item of raw.slice(0, 50)) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const slug = typeof r.slug === "string" ? r.slug.trim().slice(0, 200) : "";
    const quantity = Math.floor(Number(r.quantity));
    if (!slug || !Number.isFinite(quantity) || quantity < 1) continue;
    lines.push({
      slug,
      quantity: Math.min(quantity, 20),
      finish: typeof r.finish === "string" ? r.finish.slice(0, 60) : "",
      giftWrap: r.giftWrap === true,
      giftMessage: r.giftWrap === true && typeof r.giftMessage === "string" ? r.giftMessage.slice(0, 300) : "",
    });
  }
  return lines;
}

/** Prices a cart entirely from database values. */
export async function quoteCart(
  input: CartLineInput[],
  couponCode: string,
  paymentMethod: "prepaid" | "cod",
  settings: StoreSettings,
  tx: postgres.Sql | postgres.TransactionSql = defaultSql
): Promise<Quote> {
  const db = tx as postgres.Sql;
  const issues: string[] = [];
  const slugs = [...new Set(input.map((l) => l.slug))];
  const products = slugs.length
    ? await db<ProductRow[]>`
        select p.id, p.slug, p.name, p.price, p.compare_at_price, p.stock, p.track_inventory,
               (select i.url from product_images i where i.product_id = p.id order by i.sort_order, i.created_at limit 1) as image
        from products p where p.status = 'active' and p.slug in ${db(slugs)}`
    : [];
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  // Stock check per product (across finishes / gift-wrap variants).
  const wanted = new Map<string, number>();
  for (const l of input) wanted.set(l.slug, (wanted.get(l.slug) ?? 0) + l.quantity);

  const lines: PricedLine[] = [];
  for (const l of input) {
    const p = bySlug.get(l.slug);
    if (!p) {
      issues.push(`"${l.slug}" is no longer available and was skipped.`);
      continue;
    }
    if (p.track_inventory && (wanted.get(l.slug) ?? 0) > p.stock) {
      issues.push(p.stock > 0 ? `Only ${p.stock} of "${p.name}" left in stock.` : `"${p.name}" is out of stock.`);
      continue;
    }
    lines.push({
      ...l,
      productId: p.id,
      name: p.name,
      image: p.image ?? "",
      unitPrice: p.price,
      unitMrp: Math.max(p.compare_at_price, p.price),
      lineTotal: p.price * l.quantity,
    });
  }

  const totalItems = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.unitMrp * l.quantity, 0);
  const giftWrapTotal = lines.reduce((s, l) => s + (l.giftWrap ? settings.gift_wrap_price * l.quantity : 0), 0);
  const prepaidDiscount = paymentMethod === "prepaid" ? Math.round((subtotal * settings.prepaid_discount_percent) / 100) : 0;

  let couponDiscount = 0;
  let couponMessage = "";
  let couponId: string | null = null;
  const code = couponCode.trim().toUpperCase().slice(0, 40);
  if (code) {
    const [c] = await db<CouponRow[]>`
      select id, code::text as code, type, value, min_subtotal, min_items, max_discount,
             (starts_at is not null and starts_at > now()) as not_started,
             (ends_at is not null and ends_at < now()) as expired,
             (usage_limit is not null and used_count >= usage_limit) as limit_reached,
             is_active as usable
      from coupons where code = ${code}`;
    if (!c || !c.usable) couponMessage = "This code isn't valid.";
    else if (c.not_started) couponMessage = "This code isn't active yet.";
    else if (c.expired) couponMessage = "This code has expired.";
    else if (c.limit_reached) couponMessage = "This code has reached its usage limit.";
    else if (subtotal < c.min_subtotal) couponMessage = `Add items worth ₹${(c.min_subtotal - subtotal).toLocaleString("en-IN")} more to use this code.`;
    else if (totalItems < c.min_items) couponMessage = `This code needs at least ${c.min_items} items in your bag.`;
    else {
      couponDiscount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : Math.min(c.value, subtotal);
      if (c.max_discount != null) couponDiscount = Math.min(couponDiscount, c.max_discount);
      couponId = c.id;
      couponMessage = `Code ${c.code} applied.`;
    }
  }

  const shippingFee =
    settings.shipping_fee > 0 && !(settings.free_shipping_threshold > 0 && subtotal >= settings.free_shipping_threshold)
      ? settings.shipping_fee
      : 0;
  const paymentFee = paymentMethod === "cod" ? settings.cod_fee : settings.online_fee;
  const codAvailable = settings.cod_enabled && !(settings.cod_max_order > 0 && subtotal > settings.cod_max_order);
  const total = Math.max(0, subtotal + giftWrapTotal + shippingFee + paymentFee - prepaidDiscount - couponDiscount);

  return {
    lines,
    issues,
    totalItems,
    mrpTotal,
    subtotal,
    giftWrapTotal,
    prepaidDiscount,
    couponCode: couponId ? code : "",
    couponDiscount,
    couponMessage,
    shippingFee,
    paymentFee,
    codAvailable,
    total,
    couponId,
  };
}
