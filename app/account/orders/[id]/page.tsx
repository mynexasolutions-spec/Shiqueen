import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, Truck } from "lucide-react";
import { getMyOrder } from "@/lib/server/account";
import { Card } from "@/components/admin/ui";
import OrderBreakdown from "@/components/orders/OrderBreakdown";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/StatusBadges";
import { formatDate } from "@/lib/format";
import { getPublicSite } from "@/lib/server/content";
import { whatsappUrl } from "@/lib/site-types";

export const metadata: Metadata = { title: "Order details" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function MyOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, site] = await Promise.all([getMyOrder(id), getPublicSite()]);
  if (!order) notFound();
  const a = order.shipping_address;
  // Customers see the status changes, not internal payment bookkeeping entries.
  const history = order.history.filter((h) => !h.status.startsWith("payment:"));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/account/orders" className="mb-3 inline-flex items-center gap-1 text-base font-semibold text-[#8C671A] hover:underline">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> My orders
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-[32px] font-bold leading-tight sm:text-[38px]">Order {order.order_number}</h1>
            <p className="mt-1 text-[17px] text-[#171717]/70">Placed {formatDate(order.created_at, true)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment_status} method={order.payment_method} />
          </div>
        </div>
      </div>

      {(order.tracking_number || order.tracking_url) && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E5DEC9] bg-[#FBF7EE] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-6 w-6 shrink-0 text-[#8C671A]" aria-hidden="true" />
            <div>
              <p className="text-[17px] font-semibold">Shipped{order.courier ? ` with ${order.courier}` : ""}</p>
              {order.tracking_number && <p className="text-base text-[#171717]/70">Tracking number: {order.tracking_number}</p>}
            </div>
          </div>
          {order.tracking_url && (
            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#171717] px-5 text-base font-semibold text-white hover:bg-[#8C671A]">
              Track parcel <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title={`Items (${order.item_count})`}>
            <OrderBreakdown items={order.items} totals={order} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Delivery address">
            <p className="text-base leading-relaxed">
              <strong>{a.full_name}</strong>
              <br />
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
              <br />
              {a.city}, {a.state} – {a.pincode}
              <br />
              {a.phone}
            </p>
            <p className="mt-4 border-t border-[#EFE8DD] pt-3 text-base">
              <span className="text-[#171717]/60">Payment: </span>
              {order.payment_method === "cod" ? "Cash on Delivery" : "Prepaid"}
            </p>
          </Card>
          <Card title="Order updates">
            <OrderTimeline history={history} />
          </Card>
          <a
            href={whatsappUrl(site.content.brand.whatsapp_number, `Hi! I have a question about my order ${order.order_number}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-xl border border-[#137333]/40 bg-[#E6F4EA] text-base font-semibold text-[#137333] hover:bg-[#137333] hover:text-white"
          >
            Need help? Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
