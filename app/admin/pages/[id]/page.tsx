import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { listPagesAdmin } from "@/lib/server/pages";
import { Card, PageHeader } from "@/components/admin/ui";
import { Alert } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/button-class";
import PageForm from "@/components/admin/PageForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deletePageAction } from "@/app/admin/_actions/pages";

export const metadata: Metadata = { title: "Edit page" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function EditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const [{ id }, sp, pages] = await Promise.all([params, searchParams, listPagesAdmin()]);
  const page = pages.find((p) => p.id === id);
  if (!page) notFound();
  return (
    <>
      <PageHeader
        title={page.title}
        back={{ href: "/admin/pages", label: "All pages" }}
        actions={
          page.is_published && (
            <Link href={`/pages/${page.slug}`} target="_blank" className={buttonClass("secondary")}>
              <ExternalLink className="h-5 w-5" aria-hidden="true" /> View on store
            </Link>
          )
        }
      />
      {sp.created && (
        <div className="mb-6">
          <Alert tone="success">Page created.</Alert>
        </div>
      )}
      <PageForm key={page.id} initial={page} />
      <div className="mt-8">
        <Card title="Delete page">
          <DeleteButton action={deletePageAction} id={page.id} confirmText={`Delete the page “${page.title}”?`} label="Delete page" />
        </Card>
      </div>
    </>
  );
}
