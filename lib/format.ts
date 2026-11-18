// Formatting helpers + shared status vocab (safe for client and server).

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function formatDate(d: Date | string, withTime = false) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  });
}

export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Unpaid",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export type Tone = "neutral" | "gold" | "blue" | "green" | "red" | "amber";

export const ORDER_STATUS_TONE: Record<OrderStatus, Tone> = {
  pending: "amber",
  confirmed: "blue",
  processing: "blue",
  shipped: "gold",
  delivered: "green",
  cancelled: "red",
  returned: "neutral",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, Tone> = {
  pending: "amber",
  paid: "green",
  failed: "red",
  refunded: "neutral",
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
