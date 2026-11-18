import Link from "next/link";
import type { Metadata } from "next";
import { FileText, Plus } from "lucide-react";
import { listPagesAdmin } from "@/lib/server/pages";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { Alert } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/button-class";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Pages" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function PagesAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [pages, sp] = await Promise.all([listPagesAdmin(), searchParams]);
  return (
    <>
      <PageHeader
        title="Pages"
        description="Information pages such as shipping, returns, privacy and terms. Link them from Storefront → Footer."
        actions={
          <Link href="/admin/pages/new" className={buttonClass("primary")}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Add page
          </Link>
        }
      />
      {sp.deleted && (
        <div className="mb-5">
          <Alert tone="success">Page deleted.</Alert>
        </div>
      )}
      <Card padded={false}>
        {pages.length === 0 ? (
          <EmptyState icon={<FileText className="h-8 w-8" />} title="No pages yet" />
        ) : (
          <ul className="divide-y divide-[#EFE8DD]">
            {pages.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/pages/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-[#FDFBF7] sm:px-6">
                  <div>
                    <p className="text-lg font-semibold">{p.title}</p>
                    <p className="text-[15px] text-[#171717]/60">
                      /pages/{p.slug} · updated {formatDate(p.updated_at)}
                    </p>
                  </div>
                  {p.is_published ? <Badge tone="green">Published</Badge> : <Badge tone="amber">Draft</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
