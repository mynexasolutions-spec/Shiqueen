import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/server/session";
import { readContent } from "@/lib/server/content";
import { SECTION_BY_KEY } from "@/lib/content/schema";
import type { ContentKey } from "@/lib/content/types";
import { PageHeader } from "@/components/admin/ui";
import ContentEditor from "@/components/admin/ContentEditor";

export const metadata: Metadata = { title: "Edit storefront" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function EditSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const [{ section }] = await Promise.all([params, requireAdmin()]);
  const def = SECTION_BY_KEY[section as ContentKey];
  if (!def) notFound();
  const content = await readContent();

  return (
    <>
      <PageHeader title={def.title} description={def.description} back={{ href: "/admin/storefront", label: "Storefront" }} />
      <ContentEditor key={def.key} def={def} initial={content[def.key] as unknown as Record<string, unknown>} />
    </>
  );
}
