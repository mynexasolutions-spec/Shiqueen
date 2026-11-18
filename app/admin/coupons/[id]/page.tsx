import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoupon } from "@/lib/server/admin/coupons";
import { Card, PageHeader } from "@/components/admin/ui";
import CouponForm from "@/components/admin/CouponForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCouponAction } from "@/app/admin/_actions/coupons";

export const metadata: Metadata = { title: "Edit coupon" };

/** Date → yyyy-mm-dd in India time, for <input type="date">. */
const toInputDate = (d: Date | null) => (d ? new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) : "");

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCoupon(id);
  if (!c) notFound();
  return (
    <>
      <PageHeader title={c.code} back={{ href: "/admin/coupons", label: "All coupons" }} />
      <CouponForm
        key={c.id}
        initial={{
          id: c.id,
          code: c.code,
          description: c.description,
          type: c.type,
          value: c.value,
          min_subtotal: c.min_subtotal || "",
          min_items: c.min_items || "",
          max_discount: c.max_discount ?? "",
          usage_limit: c.usage_limit ?? "",
          starts_at: toInputDate(c.starts_at),
          ends_at: toInputDate(c.ends_at),
          is_active: c.is_active,
          used_count: c.used_count,
          show_as_offer: c.show_as_offer,
          offer_badge: c.offer_badge,
          offer_title: c.offer_title,
          offer_text: c.offer_text,
          offer_subtext: c.offer_subtext,
          offer_order: c.offer_order,
        }}
      />
      <div className="mt-8">
        <Card title="Delete coupon" description="Past orders keep the discount they received.">
          <DeleteButton action={deleteCouponAction} id={c.id} confirmText={`Delete coupon ${c.code}?`} label="Delete coupon" />
        </Card>
      </div>
    </>
  );
}
