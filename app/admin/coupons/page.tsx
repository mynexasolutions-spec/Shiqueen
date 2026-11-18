import Link from "next/link";
import type { Metadata } from "next";
import { Plus, TicketPercent } from "lucide-react";
import { listCoupons, type CouponRow } from "@/lib/server/admin/coupons";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { Alert } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/button-class";
import { formatDate, inr } from "@/lib/format";

export const metadata: Metadata = { title: "Coupons" };

function describe(c: CouponRow) {
  const parts = [c.type === "percent" ? `${c.value}% off` : `${inr(c.value)} off`];
  if (c.type === "percent" && c.max_discount) parts.push(`up to ${inr(c.max_discount)}`);
  if (c.min_subtotal) parts.push(`orders over ${inr(c.min_subtotal)}`);
  if (c.min_items) parts.push(`${c.min_items}+ items`);
  return parts.join(" · ");
}

const COUPON_STATE: Record<CouponRow["state"], { label: string; tone: "green" | "red" | "amber" | "neutral" }> = {
  inactive: { label: "Inactive", tone: "neutral" },
  expired: { label: "Expired", tone: "red" },
  scheduled: { label: "Scheduled", tone: "amber" },
  used_up: { label: "Used up", tone: "red" },
  active: { label: "Active", tone: "green" },
};

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function CouponsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [coupons, sp] = await Promise.all([listCoupons(), searchParams]);
  return (
    <>
      <PageHeader
        title="Coupons"
        description="Discount codes customers can apply at checkout."
        actions={
          <Link href="/admin/coupons/new" className={buttonClass("primary")}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Add coupon
          </Link>
        }
      />
      {sp.saved && (
        <div className="mb-5">
          <Alert tone="success">Coupon created.</Alert>
        </div>
      )}
      {sp.deleted && (
        <div className="mb-5">
          <Alert tone="success">Coupon deleted.</Alert>
        </div>
      )}
      <Card padded={false}>
        {coupons.length === 0 ? (
          <EmptyState icon={<TicketPercent className="h-8 w-8" />} title="No coupons yet" body="Create a code to run a sale or reward customers." />
        ) : (
          <ul className="divide-y divide-[#EFE8DD]">
            {coupons.map((c) => {
              const st = COUPON_STATE[c.state];
              return (
                <li key={c.id}>
                  <Link href={`/admin/coupons/${c.id}`} className="flex flex-col gap-2 px-5 py-4 hover:bg-[#FDFBF7] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="font-mono text-lg font-bold tracking-wider">{c.code}</p>
                      <p className="text-base text-[#171717]/70">{describe(c)}</p>
                      {c.description && <p className="text-[15px] text-[#171717]/55">{c.description}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[15px] text-[#171717]/65">
                      <span>
                        Used {c.used_count}
                        {c.usage_limit != null ? ` / ${c.usage_limit}` : ""}
                      </span>
                      {c.ends_at && <span>Ends {formatDate(c.ends_at)}</span>}
                      {c.show_as_offer && <Badge tone="gold">Shown as offer</Badge>}
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
