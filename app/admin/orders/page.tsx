import Link from "next/link";
import type { Metadata } from "next";
import { Eye, Printer, ShoppingBag } from "lucide-react";
import { listOrdersAdmin } from "@/lib/server/admin/orders";
import { Card, EmptyState, FilterSelect, PageHeader, Pagination, SearchBar, withParams } from "@/components/admin/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/StatusBadges";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_STATUSES, PAYMENT_STATUS_LABEL, formatDate, inr } from "@/lib/format";

export const metadata: Metadata = { title: "Orders" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const filters = { q: sp.q, status: sp.status, payment: sp.payment };
  const data = await listOrdersAdmin({ ...filters, page: Number(sp.page ?? 1) });
  const hasFilters = Boolean(sp.q || sp.status || sp.payment);

  return (
    <>
      <PageHeader title="Orders" description={`${data.total} order${data.total === 1 ? "" : "s"}${hasFilters ? " match your filters" : ""}`} />

      <div className="mb-5">
        <SearchBar action="/admin/orders" q={sp.q} placeholder="Search order number, name, email or phone">
          <FilterSelect
            name="status"
            label="Order status"
            value={sp.status}
            options={[{ value: "", label: "Any status" }, ...ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABEL[s] }))]}
          />
          <FilterSelect
            name="payment"
            label="Payment status"
            value={sp.payment}
            options={[{ value: "", label: "Any payment" }, ...PAYMENT_STATUSES.map((s) => ({ value: s, label: PAYMENT_STATUS_LABEL[s] }))]}
          />
        </SearchBar>
        {hasFilters && (
          <Link href="/admin/orders" className="mt-3 inline-block text-base font-semibold text-[#8C671A] hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      <Card padded={false}>
        {data.items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title={hasFilters ? "No orders match" : "No orders yet"}
            body={hasFilters ? "Try a different search or clear the filters." : "New orders from the store will appear here."}
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-base">
                <thead className="border-b border-[#EFE8DD] bg-[#FDFBF7] text-[15px] text-[#171717]/65">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Order</th>
                    <th className="px-4 py-3.5 font-semibold">Customer</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold">Payment</th>
                    <th className="px-4 py-3.5 text-right font-semibold">Total</th>
                    <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DD]">
                  {data.items.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FDFBF7]">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[#171717] hover:text-[#8C671A] hover:underline">
                          {o.order_number}
                        </Link>
                        <p className="text-[15px] text-[#171717]/55">{formatDate(o.created_at, true)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{o.customer_name}</p>
                        <p className="text-[15px] text-[#171717]/55">{o.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-4">
                        <PaymentStatusBadge status={o.payment_status} method={o.payment_method} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <p className="font-semibold">{inr(o.total)}</p>
                        <p className="text-[15px] text-[#171717]/55">
                          {o.item_count} item{o.item_count === 1 ? "" : "s"}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9CFB8] bg-white px-3 text-sm font-semibold text-[#171717] transition hover:border-[#8C671A] hover:text-[#8C671A]"
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Details
                          </Link>
                          <Link
                            href={`/admin/orders/${o.id}/receipt`}
                            title="Print receipt"
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9CFB8] bg-[#FDFBF7] px-3 text-sm font-semibold text-[#171717] transition hover:border-[#8C671A] hover:text-[#8C671A]"
                          >
                            <Printer className="h-4 w-4" aria-hidden="true" />
                            Receipt
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-[#EFE8DD] md:hidden">
              {data.items.map((o) => (
                <li key={o.id} className="px-4 py-4">
                  <Link href={`/admin/orders/${o.id}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{o.order_number}</p>
                        <p className="text-base text-[#171717]/70">{o.customer_name}</p>
                        <p className="text-[15px] text-[#171717]/55">{formatDate(o.created_at, true)}</p>
                      </div>
                      <p className="text-lg font-semibold">{inr(o.total)}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <OrderStatusBadge status={o.status} />
                      <PaymentStatusBadge status={o.payment_status} method={o.payment_method} />
                    </div>
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9CFB8] bg-white px-3 text-sm font-semibold text-[#171717]"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      View details
                    </Link>
                    <Link
                      href={`/admin/orders/${o.id}/receipt`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9CFB8] bg-[#FDFBF7] px-3 text-sm font-semibold text-[#171717]"
                    >
                      <Printer className="h-4 w-4" aria-hidden="true" />
                      Print receipt
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Pagination page={data.page} totalPages={data.totalPages} hrefFor={(p) => withParams("/admin/orders", { ...filters, page: p })} />
    </>
  );
}
