import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { getDashboardData } from "@/lib/server/admin/dashboard";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/orders/StatusBadges";
import RevenueChart from "@/components/admin/RevenueChart";
import { buttonClass } from "@/components/ui/button-class";
import { formatDate, inr, type OrderStatus } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

function Delta({ now, prev, label }: { now: number; prev: number; label: string }) {
  if (prev === 0 && now === 0) return <p className="mt-1 text-[15px] text-[#171717]/55">Nothing yet in this period</p>;
  if (prev === 0) return <p className="mt-1 text-[15px] text-[#171717]/55">New this period</p>;
  const pct = Math.round(((now - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <p className={`mt-1 text-[15px] font-medium ${up ? "text-[#0F5B2B]" : "text-[#912018]"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct)}% <span className="font-normal text-[#171717]/55">{label}</span>
    </p>
  );
}

function StatTile({ label, value, children, href }: { label: string; value: string; children?: React.ReactNode; href?: string }) {
  const body = (
    <>
      <p className="text-base font-medium text-[#171717]/65">{label}</p>
      <p className="mt-1.5 text-[34px] font-semibold leading-tight text-[#171717]">{value}</p>
      {children}
    </>
  );
  const cls = "block rounded-2xl border border-[#E5DEC9] bg-white p-5 shadow-[0_1px_2px_rgba(23,23,23,0.04)] sm:p-6";
  return href ? (
    <Link href={href} className={`${cls} transition hover:border-[#C59B27]`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function AdminDashboard() {
  const { kpi, daily, recentOrders, lowStock, catalog } = await getDashboardData();
  const fourteenDay = daily.reduce((s, d) => s + d.revenue, 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Here's how your store is doing."
        actions={
          <>
            <Link href="/admin/products/new" className={buttonClass("primary")}>
              <Plus className="h-5 w-5" aria-hidden="true" /> Add product
            </Link>
            <Link href="/admin/orders?status=pending" className={buttonClass("secondary")}>
              View pending orders
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Revenue, last 30 days" value={inr(kpi.revenue_30)}>
          <Delta now={kpi.revenue_30} prev={kpi.revenue_prev_30} label="vs previous 30 days" />
        </StatTile>
        <StatTile label="Orders, last 30 days" value={kpi.orders_30.toLocaleString("en-IN")} href="/admin/orders">
          <Delta now={kpi.orders_30} prev={kpi.orders_prev_30} label="vs previous 30 days" />
        </StatTile>
        <StatTile label="Needs attention" value={kpi.pending.toLocaleString("en-IN")} href="/admin/orders?status=pending">
          <p className="mt-1 text-[15px] text-[#171717]/60">
            pending · {kpi.to_ship} waiting to ship
          </p>
        </StatTile>
        <StatTile label="Customers" value={kpi.customers.toLocaleString("en-IN")} href="/admin/customers?role=customer">
          <p className="mt-1 text-[15px] text-[#171717]/60">+{kpi.customers_30} in the last 30 days</p>
        </StatTile>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Daily revenue" description={`Last 14 days · ${inr(fourteenDay)} total (excludes cancelled & returned)`}>
          <RevenueChart data={daily} />
        </Card>

        <Card title="Catalogue">
          <dl className="space-y-3 text-base">
            <div className="flex justify-between">
              <dt className="text-[#171717]/65">Products</dt>
              <dd className="font-semibold">{catalog.products}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#171717]/65">Active in store</dt>
              <dd className="font-semibold">{catalog.active}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#171717]/65">Categories</dt>
              <dd className="font-semibold">{catalog.categories}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-col gap-2">
            <Link href="/admin/products" className={buttonClass("secondary", "md", "w-full")}>
              Manage products
            </Link>
            <Link href="/admin/categories" className={buttonClass("secondary", "md", "w-full")}>
              Manage categories
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Recent orders"
          padded={false}
          actions={
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-base font-semibold text-[#8C671A] hover:underline">
              View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        >
          {recentOrders.length === 0 ? (
            <EmptyState title="No orders yet" body="Orders placed on the store will show up here." />
          ) : (
            <ul className="divide-y divide-[#EFE8DD]">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-[#FDFBF7] sm:px-6">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {o.order_number} <span className="font-normal text-[#171717]/65">· {o.customer_name}</span>
                      </p>
                      <p className="text-[15px] text-[#171717]/55">{formatDate(o.created_at, true)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <OrderStatusBadge status={o.status as OrderStatus} />
                      <span className="text-lg font-semibold">{inr(o.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Low stock"
          padded={false}
          actions={
            <Link href="/admin/products?stock=low" className="inline-flex items-center gap-1 text-base font-semibold text-[#8C671A] hover:underline">
              View <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        >
          {lowStock.length === 0 ? (
            <p className="px-6 py-6 text-base text-[#171717]/65">All active products are well stocked. ✨</p>
          ) : (
            <ul className="divide-y divide-[#EFE8DD]">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-[#FDFBF7] sm:px-6">
                    <span className="min-w-0 truncate text-base font-medium">{p.name}</span>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 text-base font-semibold ${p.stock <= 0 ? "text-[#912018]" : "text-[#8A4B00]"}`}>
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      {p.stock <= 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
