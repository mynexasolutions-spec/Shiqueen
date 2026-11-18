// Store-wide settings editable from Admin → Settings.
// Defaults mirror what the storefront previously hard-coded.

export interface StoreSettings {
  store_name: string;
  support_email: string;
  support_phone: string;
  order_notification_email: string;
  low_stock_threshold: number;

  // Checkout extras
  gift_wrap_price: number;
  shipping_fee: number;
  free_shipping_threshold: number; // 0 = no threshold

  // Payment method: online (UPI / cards / net-banking — confirmed manually for now)
  online_enabled: boolean;
  online_label: string;
  online_description: string;
  online_fee: number; // extra charge for choosing online payment
  prepaid_discount_percent: number; // discount for choosing online payment
  online_instructions: string; // shown after ordering + in the confirmation email (e.g. UPI ID)

  // Payment method: cash on delivery
  cod_enabled: boolean;
  cod_label: string;
  cod_description: string;
  cod_fee: number; // extra charge for choosing COD
  cod_max_order: number; // 0 = no limit; COD hidden for orders above this

  // Reviews
  reviews_enabled: boolean;
  reviews_require_approval: boolean;
  reviews_buyers_only: boolean;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "SHIQUEEN",
  support_email: "shiqueenofficial@gmail.com",
  support_phone: "",
  order_notification_email: "shiqueenofficial@gmail.com",
  low_stock_threshold: 5,

  gift_wrap_price: 50,
  shipping_fee: 0,
  free_shipping_threshold: 0,

  online_enabled: true,
  online_label: "UPI / Cards / NetBanking",
  online_description: "Our team will share a secure payment link on WhatsApp",
  online_fee: 0,
  prepaid_discount_percent: 10,
  online_instructions: "Our team will contact you on WhatsApp shortly with a secure payment link to complete your order.",

  cod_enabled: true,
  cod_label: "Cash on Delivery (COD)",
  cod_description: "Pay via cash or UPI at your doorstep",
  cod_fee: 0,
  cod_max_order: 0,

  reviews_enabled: true,
  reviews_require_approval: true,
  reviews_buyers_only: false,
};

/** Settings that are safe to send to every visitor's browser. */
export type PublicSettings = Pick<
  StoreSettings,
  | "gift_wrap_price"
  | "shipping_fee"
  | "free_shipping_threshold"
  | "online_enabled"
  | "online_label"
  | "online_description"
  | "online_fee"
  | "prepaid_discount_percent"
  | "cod_enabled"
  | "cod_label"
  | "cod_description"
  | "cod_fee"
  | "cod_max_order"
  | "reviews_enabled"
>;

export function toPublicSettings(s: StoreSettings): PublicSettings {
  return {
    gift_wrap_price: s.gift_wrap_price,
    shipping_fee: s.shipping_fee,
    free_shipping_threshold: s.free_shipping_threshold,
    online_enabled: s.online_enabled,
    online_label: s.online_label,
    online_description: s.online_description,
    online_fee: s.online_fee,
    prepaid_discount_percent: s.prepaid_discount_percent,
    cod_enabled: s.cod_enabled,
    cod_label: s.cod_label,
    cod_description: s.cod_description,
    cod_fee: s.cod_fee,
    cod_max_order: s.cod_max_order,
    reviews_enabled: s.reviews_enabled,
  };
}
