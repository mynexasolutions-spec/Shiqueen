"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/server/content";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { isUuid } from "@/lib/server/admin/categories";

export interface FormState {
  error?: string;
  message?: string;
}

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);
const optInt = (fd: FormData, key: string) => {
  const raw = str(fd, key, 20);
  if (!raw) return null;
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) ? n : NaN;
};
/** <input type="date"> → start/end of that day in India time. */
const istDate = (raw: string, endOfDay: boolean) => (raw ? new Date(`${raw}T${endOfDay ? "23:59:59" : "00:00:00"}+05:30`) : null);

export async function saveCouponAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  if (id && !isUuid(id)) return { error: "Invalid coupon." };

  const code = str(fd, "code", 40).toUpperCase().replace(/\s+/g, "");
  const type = str(fd, "type", 10) === "fixed" ? "fixed" : "percent";
  const value = optInt(fd, "value");
  const minSubtotal = optInt(fd, "min_subtotal") ?? 0;
  const minItems = optInt(fd, "min_items") ?? 0;
  const maxDiscount = optInt(fd, "max_discount");
  const usageLimit = optInt(fd, "usage_limit");
  const startsAt = istDate(str(fd, "starts_at", 10), false);
  const endsAt = istDate(str(fd, "ends_at", 10), true);

  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return { error: "Code must be 3–40 letters, numbers, dashes or underscores." };
  if (value === null || !Number.isFinite(value) || value <= 0) return { error: "Enter a discount value greater than 0." };
  if (type === "percent" && value > 100) return { error: "A percentage discount can't exceed 100%." };
  for (const [label, n] of [["Minimum order", minSubtotal], ["Minimum items", minItems], ["Maximum discount", maxDiscount], ["Usage limit", usageLimit]] as const) {
    if (n !== null && (!Number.isFinite(n) || n < 0)) return { error: `${label} must be 0 or more.` };
  }
  if (startsAt && endsAt && endsAt < startsAt) return { error: "End date must be after the start date." };

  const values = {
    code,
    description: str(fd, "description", 200),
    type,
    value,
    min_subtotal: minSubtotal,
    min_items: minItems,
    max_discount: maxDiscount || null,
    usage_limit: usageLimit || null,
    starts_at: startsAt,
    ends_at: endsAt,
    is_active: fd.get("is_active") === "on",
    show_as_offer: fd.get("show_as_offer") === "on",
    offer_badge: str(fd, "offer_badge", 40),
    offer_title: str(fd, "offer_title", 100),
    offer_text: str(fd, "offer_text", 200),
    offer_subtext: str(fd, "offer_subtext", 200),
    offer_order: Math.max(-999, Math.min(999, Math.floor(Number(str(fd, "offer_order", 6) || 0)) || 0)),
  };
  if (values.show_as_offer && !values.offer_title) return { error: "Add an offer title to show this coupon on product pages." };

  try {
    if (id) {
      const updated = await sql`update coupons set ${sql(values)}, updated_at = now() where id = ${id} returning id`;
      if (!updated.length) return { error: "Coupon not found." };
    } else {
      await sql`insert into coupons ${sql(values)}`;
    }
  } catch (err) {
    if ((err as { code?: string }).code === "23505") return { error: `The code ${code} already exists.` };
    console.error("[admin] saveCoupon", err);
    return { error: "Could not save the coupon." };
  }
  updateTag(CONTENT_TAG);
  if (!id) redirect("/admin/coupons?saved=1");
  refresh();
  return { message: "Coupon saved." };
}

export async function deleteCouponAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  if (!isUuid(id)) return { error: "Invalid coupon." };
  await sql`delete from coupons where id = ${id}`;
  updateTag(CONTENT_TAG);
  redirect("/admin/coupons?deleted=1");
}
