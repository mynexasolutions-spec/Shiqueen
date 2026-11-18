import type { Metadata } from "next";
import { requireAdmin } from "@/lib/server/session";
import { PageHeader } from "@/components/admin/ui";
import PageForm from "@/components/admin/PageForm";

export const metadata: Metadata = { title: "New page" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function NewPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New page" back={{ href: "/admin/pages", label: "All pages" }} />
      <PageForm initial={{ title: "", slug: "", body: "", is_published: true }} />
    </>
  );
}
