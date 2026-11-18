import Link from "next/link";
import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { listReviewsAdmin } from "@/lib/server/admin/reviews";
import { getSettings } from "@/lib/server/settings";
import { Card, EmptyState, PageHeader, Pagination, SearchBar, withParams } from "@/components/admin/ui";
import ReviewCard from "@/components/admin/ReviewCard";

export const metadata: Metadata = { title: "Reviews" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const filters = { status: sp.status, q: sp.q };
  const [data, settings] = await Promise.all([listReviewsAdmin({ ...filters, page: Number(sp.page ?? 1) }), getSettings()]);
  const tabs = [
    { key: "", label: "All", count: data.counts.pending + data.counts.approved + data.counts.hidden },
    { key: "pending", label: "Awaiting approval", count: data.counts.pending },
    { key: "approved", label: "Live", count: data.counts.approved },
    { key: "featured", label: "On homepage", count: data.counts.featured },
    { key: "hidden", label: "Hidden", count: data.counts.hidden },
  ];

  return (
    <>
      <PageHeader
        title="Reviews"
        description={
          <>
            Customer reviews {settings.reviews_require_approval ? "wait here for your approval" : "go live immediately"}.{" "}
            <Link href="/admin/settings" className="font-semibold text-[#8C671A] hover:underline">
              Change in Settings
            </Link>
          </>
        }
      />

      <nav aria-label="Review filters" className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const active = (sp.status ?? "") === t.key;
          return (
            <Link
              key={t.key}
              href={withParams("/admin/reviews", { status: t.key, q: sp.q })}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-base font-semibold transition ${
                active ? "bg-[#171717] text-white" : "border border-[#D9CFB8] bg-white hover:border-[#8C671A]"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 text-[14px] ${active ? "bg-white/20" : "bg-[#F3EEE4]"}`}>{t.count}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mb-5">
        <SearchBar action="/admin/reviews" q={sp.q} placeholder="Search product, name or review text">
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
        </SearchBar>
      </div>

      <Card padded={false}>
        {data.items.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText className="h-8 w-8" />}
            title="No reviews here"
            body="When customers review products, they'll appear here for you to approve, reply to or feature on the homepage."
          />
        ) : (
          <ul className="divide-y divide-[#EFE8DD]">
            {data.items.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </ul>
        )}
      </Card>
      <Pagination page={data.page} totalPages={data.totalPages} hrefFor={(p) => withParams("/admin/reviews", { ...filters, page: p })} />
    </>
  );
}
