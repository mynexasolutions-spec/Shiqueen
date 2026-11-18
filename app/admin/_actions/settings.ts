"use server";

import { refresh, updateTag } from "next/cache";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { CONTENT_TAG } from "@/lib/server/content";
import { DEFAULT_SETTINGS, type StoreSettings } from "@/lib/settings-defaults";

export interface FormState {
  error?: string;
  message?: string;
}

const str = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? "").trim().slice(0, max);
const nonNegInt = (fd: FormData, key: string) => {
  const n = Math.floor(Number(str(fd, key, 12) || 0));
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};
const on = (fd: FormData, key: string) => fd.get(key) === "on";

const LABELS: Partial<Record<keyof StoreSettings, string>> = {
  prepaid_discount_percent: "online payment discount",
  gift_wrap_price: "gift wrap price",
  shipping_fee: "shipping fee",
  free_shipping_threshold: "free shipping amount",
  low_stock_threshold: "low-stock warning",
  online_fee: "online payment charge",
  cod_fee: "COD charge",
  cod_max_order: "COD order limit",
};

export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const next: StoreSettings = {
    store_name: str(fd, "store_name", 80) || DEFAULT_SETTINGS.store_name,
    support_email: str(fd, "support_email", 200),
    support_phone: str(fd, "support_phone", 20),
    order_notification_email: str(fd, "order_notification_email", 200),
    low_stock_threshold: nonNegInt(fd, "low_stock_threshold"),

    gift_wrap_price: nonNegInt(fd, "gift_wrap_price"),
    shipping_fee: nonNegInt(fd, "shipping_fee"),
    free_shipping_threshold: nonNegInt(fd, "free_shipping_threshold"),

    online_enabled: on(fd, "online_enabled"),
    online_label: str(fd, "online_label", 80) || DEFAULT_SETTINGS.online_label,
    online_description: str(fd, "online_description", 200),
    online_fee: nonNegInt(fd, "online_fee"),
    prepaid_discount_percent: nonNegInt(fd, "prepaid_discount_percent"),
    online_instructions: str(fd, "online_instructions", 1000),

    cod_enabled: on(fd, "cod_enabled"),
    cod_label: str(fd, "cod_label", 80) || DEFAULT_SETTINGS.cod_label,
    cod_description: str(fd, "cod_description", 200),
    cod_fee: nonNegInt(fd, "cod_fee"),
    cod_max_order: nonNegInt(fd, "cod_max_order"),

    reviews_enabled: on(fd, "reviews_enabled"),
    reviews_require_approval: on(fd, "reviews_require_approval"),
    reviews_buyers_only: on(fd, "reviews_buyers_only"),
  };

  for (const [k, v] of Object.entries(next)) {
    if (typeof v === "number" && !Number.isFinite(v)) {
      return { error: `Please enter a valid number for ${LABELS[k as keyof StoreSettings] ?? k.replace(/_/g, " ")}.` };
    }
  }
  if (!next.online_enabled && !next.cod_enabled) return { error: "Keep at least one payment method switched on, or customers can't check out." };
  if (next.prepaid_discount_percent > 90) return { error: "The online payment discount can't be more than 90%." };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (next.support_email && !emailRe.test(next.support_email)) return { error: "Support email isn't valid." };
  if (next.order_notification_email && !emailRe.test(next.order_notification_email)) return { error: "Order notification email isn't valid." };

  await sql.begin(async (tx) => {
    for (const [key, value] of Object.entries(next)) {
      await tx`insert into settings (key, value, updated_at) values (${key}, ${tx.json(value as never)}, now())
               on conflict (key) do update set value = excluded.value, updated_at = now()`;
    }
  });
  updateTag(CONTENT_TAG);
  refresh();
  return { message: "Settings saved." };
}
