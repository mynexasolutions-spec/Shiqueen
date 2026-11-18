import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";
import { isUuid } from "./categories";

export interface CouponRow {
  id: string;
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number;
  min_subtotal: number;
  min_items: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: Date | null;
  ends_at: Date | null;
  is_active: boolean;
  show_as_offer: boolean;
  offer_badge: string;
  offer_title: string;
  offer_text: string;
  offer_subtext: string;
  offer_order: number;
  /** Computed in the database so pages never need the current time while rendering. */
  state: "inactive" | "expired" | "scheduled" | "used_up" | "active";
}

export async function listCoupons(): Promise<CouponRow[]> {
  await requireAdmin();
  const rows = await sql<CouponRow[]>`
    select id, code::text as code, description, type, value, min_subtotal, min_items, max_discount, usage_limit, used_count,
           starts_at, ends_at, is_active, show_as_offer, offer_badge, offer_title, offer_text, offer_subtext, offer_order,
           case when not is_active then 'inactive'
                when ends_at is not null and ends_at < now() then 'expired'
                when starts_at is not null and starts_at > now() then 'scheduled'
                when usage_limit is not null and used_count >= usage_limit then 'used_up'
                else 'active' end as state
    from coupons order by created_at desc`;
  return rows.map((r) => ({ ...r }));
}

export async function getCoupon(id: string): Promise<CouponRow | null> {
  await requireAdmin();
  if (!isUuid(id)) return null;
  const all = await listCoupons();
  return all.find((c) => c.id === id) ?? null;
}
