import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CornerDownRight, FolderTree, Pencil, Plus } from "lucide-react";
import { listCategoriesAdmin } from "@/lib/server/admin/categories";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { Alert } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/button-class";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCategoryAction } from "@/app/admin/_actions/categories";

export const metadata: Metadata = { title: "Categories" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [categories, sp] = await Promise.all([listCategoriesAdmin(), searchParams]);

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organise your shop into categories and nested sub-categories."
        actions={
          <Link href="/admin/categories/new" className={buttonClass("primary")}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Add category
          </Link>
        }
      />

      {sp.saved && (
        <div className="mb-5">
          <Alert tone="success">Category “{sp.saved}” created.</Alert>
        </div>
      )}
      {sp.deleted && (
        <div className="mb-5">
          <Alert tone="success">Category deleted.</Alert>
        </div>
      )}

      <Card padded={false}>
        {categories.length === 0 ? (
          <EmptyState
            icon={<FolderTree className="h-8 w-8" />}
            title="No categories yet"
            body="Create your first category, then add sub-categories inside it."
            action={
              <Link href="/admin/categories/new" className={buttonClass("primary")}>
                Add category
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-[#EFE8DD]">
            {categories.map((c) => (
              <li key={c.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-4" style={{ paddingLeft: `min(${Math.min(c.depth, 6) * 28}px, ${Math.min(c.depth, 6) * 5}vw)` }}>
                  {c.depth > 0 && <CornerDownRight className="h-5 w-5 shrink-0 text-[#C59B27]" aria-hidden="true" />}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF7F2]">
                    {c.image_url ? (
                      <Image src={c.image_url} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[13px] text-[#B42318]">No image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/admin/categories/${c.id}`} className="block truncate text-lg font-semibold text-[#171717] hover:text-[#8C671A]">
                      {c.name}
                    </Link>
                    <p className="truncate text-[15px] text-[#171717]/60">/{c.slug}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {(c.product_count > 0 || c.child_count === 0) && (
                        <Badge tone="neutral">
                          {c.product_count} product{c.product_count === 1 ? "" : "s"}
                        </Badge>
                      )}
                      {c.child_count > 0 && <Badge tone="blue">{c.child_count} sub-categor{c.child_count === 1 ? "y" : "ies"}</Badge>}
                      {!c.is_active && <Badge tone="red">Hidden</Badge>}
                      {c.depth === 0 && c.show_on_home && c.is_active && <Badge tone="gold">On homepage</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0" style={{ paddingLeft: undefined }}>
                  <Link href={`/admin/categories/new?parent=${c.id}`} className={buttonClass("secondary", "sm")}>
                    <Plus className="h-4 w-4" aria-hidden="true" /> Sub-category
                  </Link>
                  <Link href={`/admin/categories/${c.id}`} className={buttonClass("secondary", "sm")}>
                    <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                  </Link>
                  <DeleteButton
                    action={deleteCategoryAction}
                    id={c.id}
                    confirmText={`Delete the category “${c.name}”? This can't be undone.`}
                    label="Delete"
                    size="sm"
                    variant="secondary"
                    className="border-[#F4C7C3] text-[#912018] hover:border-[#B42318] hover:bg-[#FEF3F2] hover:text-[#912018]"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
