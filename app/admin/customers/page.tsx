import Link from "next/link";
import type { Metadata } from "next";
import { Users } from "lucide-react";
import { listCustomersAdmin } from "@/lib/server/admin/customers";
import { Badge, Card, EmptyState, FilterSelect, PageHeader, Pagination, SearchBar, withParams } from "@/components/admin/ui";
import { formatDate, inr } from "@/lib/format";

export const metadata: Metadata = { title: "Customers" };

function StatusBadges({ c }: { c: { role: string; is_active: boolean; verified: boolean } }) {
  return (
    <div className="flex flex-wrap gap-2">
      {c.role === "admin" && <Badge tone="gold">Admin</Badge>}
      {!c.is_active && <Badge tone="red">Disabled</Badge>}
      {!c.verified && <Badge tone="amber">Email not verified</Badge>}
    </div>
  );
}

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const filters = { q: sp.q, role: sp.role };
  const data = await listCustomersAdmin({ ...filters, page: Number(sp.page ?? 1) });
  const hasFilters = Boolean(sp.q || sp.role);

  return (
    <>
      <PageHeader title="Customers" description={`${data.total} account${data.total === 1 ? "" : "s"}${hasFilters ? " match your filters" : ""}`} />

      <div className="mb-5">
        <SearchBar action="/admin/customers" q={sp.q} placeholder="Search name, email or phone">
          <FilterSelect
            name="role"
            label="Role"
            value={sp.role}
            options={[
              { value: "", label: "Everyone" },
              { value: "customer", label: "Customers" },
              { value: "admin", label: "Admins" },
            ]}
          />
        </SearchBar>
      </div>

      <Card padded={false}>
        {data.items.length === 0 ? (
          <EmptyState icon={<Users className="h-8 w-8" />} title={hasFilters ? "No accounts match" : "No customers yet"} body="Customers appear here once they create an account." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-base">
                <thead className="border-b border-[#EFE8DD] bg-[#FDFBF7] text-[15px] text-[#171717]/65">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Customer</th>
                    <th className="px-4 py-3.5 font-semibold">Phone</th>
                    <th className="px-4 py-3.5 font-semibold">Orders</th>
                    <th className="px-4 py-3.5 font-semibold">Spent</th>
                    <th className="px-6 py-3.5 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DD]">
                  {data.items.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FDFBF7]">
                      <td className="px-6 py-4">
                        <Link href={`/admin/customers/${c.id}`} className="font-semibold text-[#171717] hover:text-[#8C671A]">
                          {c.name || "(no name)"}
                        </Link>
                        <p className="text-[15px] text-[#171717]/60">{c.email}</p>
                        <div className="mt-1.5">
                          <StatusBadges c={c} />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#171717]/75">{c.phone || "—"}</td>
                      <td className="px-4 py-4">{c.order_count}</td>
                      <td className="px-4 py-4 font-semibold">{inr(c.total_spent)}</td>
                      <td className="px-6 py-4 text-[#171717]/75">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-[#EFE8DD] md:hidden">
              {data.items.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/customers/${c.id}`} className="block px-4 py-4">
                    <p className="font-semibold">{c.name || "(no name)"}</p>
                    <p className="break-all text-base text-[#171717]/65">{c.email}</p>
                    <p className="mt-1 text-base">
                      {c.order_count} order{c.order_count === 1 ? "" : "s"} · <span className="font-semibold">{inr(c.total_spent)}</span>
                    </p>
                    <div className="mt-2">
                      <StatusBadges c={c} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Pagination page={data.page} totalPages={data.totalPages} hrefFor={(p) => withParams("/admin/customers", { ...filters, page: p })} />
    </>
  );
}
