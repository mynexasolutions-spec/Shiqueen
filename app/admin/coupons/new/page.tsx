import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import CouponForm from "@/components/admin/CouponForm";

export const metadata: Metadata = { title: "New coupon" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default function NewCouponPage() {
  return (
    <>
      <PageHeader title="New coupon" back={{ href: "/admin/coupons", label: "All coupons" }} />
      <CouponForm
        initial={{
          code: "",
          description: "",
          type: "percent",
          value: "",
          min_subtotal: "",
          min_items: "",
          max_discount: "",
          usage_limit: "",
          starts_at: "",
          ends_at: "",
          is_active: true,
          show_as_offer: false,
          offer_badge: "",
          offer_title: "",
          offer_text: "",
          offer_subtext: "",
          offer_order: 0,
        }}
      />
    </>
  );
}
