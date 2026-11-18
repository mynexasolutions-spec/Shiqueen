import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { getOrderAdmin } from "@/lib/server/admin/orders";
import { Card, DetailRow, PageHeader } from "@/components/admin/ui";
import OrderBreakdown from "@/components/orders/OrderBreakdown";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/StatusBadges";
import { NotesForm, PaymentForm, ShippingForm, StatusForm } from "@/components/admin/OrderForms";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Order" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderAdmin(id);
  if (!order) notFound();
  const a = order.shipping_address;
  const digits = order.phone.replace(/\D/g, "");
  const waNumber = digits.length === 10 ? `91${digits}` : digits;

  return (
    <>
      <PageHeader
        title={`Order ${order.order_number}`}
        description={`Placed ${formatDate(order.created_at, true)}`}
        back={{ href: "/admin/orders", label: "All orders" }}
        actions={
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment_status} method={order.payment_method} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title={`Items (${order.item_count})`}>
            <OrderBreakdown items={order.items} totals={order} />
          </Card>

          <Card title="Customer & delivery">
            <dl className="divide-y divide-[#EFE8DD]">
              <DetailRow label="Customer">
                {order.user_id ? (
                  <Link href={`/admin/customers/${order.user_id}`} className="font-semibold text-[#8C671A] hover:underline">
                    {order.customer_name}
                  </Link>
                ) : (
                  <>
                    {order.customer_name} <span className="text-[#171717]/55">(guest checkout)</span>
                  </>
                )}
              </DetailRow>
              <DetailRow label="Phone">
                <span className="flex flex-wrap items-center gap-3">
                  {order.phone}
                  <a href={`tel:${order.phone}`} className="inline-flex items-center gap-1 font-semibold text-[#8C671A] hover:underline">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Call
                  </a>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#137333] hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                </span>
              </DetailRow>
              <DetailRow label="Email">
                {order.email ? (
                  <a href={`mailto:${order.email}`} className="inline-flex items-center gap-1.5 text-[#8C671A] hover:underline">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {order.email}
                  </a>
                ) : (
                  "—"
                )}
              </DetailRow>
              <DetailRow label="Ship to">
                {a.full_name}
                <br />
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.state} – {a.pincode}
              </DetailRow>
              {order.customer_notes && <DetailRow label="Customer note">{order.customer_notes}</DetailRow>}
            </dl>
          </Card>

          <Card title="Timeline">
            <OrderTimeline history={order.history} showAuthor />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Fulfilment">
            <StatusForm id={order.id} status={order.status} hasEmail={Boolean(order.email)} />
          </Card>
          <Card title="Payment">
            <PaymentForm id={order.id} paymentStatus={order.payment_status} />
          </Card>
          <Card title="Shipping & tracking">
            <ShippingForm id={order.id} courier={order.courier} trackingNumber={order.tracking_number} trackingUrl={order.tracking_url} />
          </Card>
          <Card title="Internal notes">
            <NotesForm id={order.id} notes={order.admin_notes} />
          </Card>
        </div>
      </div>
    </>
  );
}
