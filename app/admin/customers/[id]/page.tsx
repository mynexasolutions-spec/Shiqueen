import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomerAdmin } from "@/lib/server/admin/customers";
import { listOrdersAdmin } from "@/lib/server/admin/orders";
import { requireAdmin } from "@/lib/server/session";
import { Badge, Card, DetailRow, EmptyState, PageHeader } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/orders/StatusBadges";
import CustomerActions from "@/components/admin/CustomerActions";
import { formatDate, inr } from "@/lib/format";

export const metadata: Metadata = { title: "Customer" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [me, customer] = await Promise.all([requireAdmin(), getCustomerAdmin(id)]);
  if (!customer) notFound();
  const orders = await listOrdersAdmin({ userId: customer.id });

  return (
    <>
      <PageHeader
        title={customer.name || customer.email}
        description={`Customer since ${formatDate(customer.created_at)}`}
        back={{ href: "/admin/customers", label: "All customers" }}
        actions={
          <div className="flex flex-wrap gap-2">
            {customer.role === "admin" && <Badge tone="gold">Admin</Badge>}
            {!customer.is_active && <Badge tone="red">Disabled</Badge>}
            {!customer.verified && <Badge tone="amber">Email not verified</Badge>}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title={`Orders (${customer.order_count})`} padded={false}>
            {orders.items.length === 0 ? (
              <EmptyState title="No orders yet" />
            ) : (
              <ul className="divide-y divide-[#EFE8DD]">
                {orders.items.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-[#FDFBF7] sm:px-6">
                      <div>
                        <p className="font-semibold">{o.order_number}</p>
                        <p className="text-[15px] text-[#171717]/60">{formatDate(o.created_at, true)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <OrderStatusBadge status={o.status} />
                        <span className="text-lg font-semibold">{inr(o.total)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Saved addresses">
            {customer.addresses.length === 0 ? (
              <p className="text-base text-[#171717]/65">No saved addresses.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {customer.addresses.map((a) => (
                  <li key={a.id} className="rounded-xl border border-[#E5DEC9] p-4 text-base leading-relaxed">
                    <p className="font-semibold">
                      {a.full_name} {a.is_default && <Badge tone="gold">Default</Badge>}
                    </p>
                    <p>{a.line1}</p>
                    {a.line2 && <p>{a.line2}</p>}
                    <p>
                      {a.city}, {a.state} – {a.pincode}
                    </p>
                    <p className="text-[#171717]/65">{a.phone}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Profile">
            <dl className="divide-y divide-[#EFE8DD]">
              <DetailRow label="Email">
                <span className="break-all">{customer.email}</span>
              </DetailRow>
              <DetailRow label="Phone">{customer.phone || "—"}</DetailRow>
              <DetailRow label="Total spent">{inr(customer.total_spent)}</DetailRow>
              <DetailRow label="Last sign-in">{customer.last_login_at ? formatDate(customer.last_login_at, true) : "Never"}</DetailRow>
            </dl>
          </Card>
          <Card title="Account access">
            <CustomerActions id={customer.id} isActive={customer.is_active} role={customer.role} isSelf={me.id === customer.id} />
          </Card>
        </div>
      </div>
    </>
  );
}
