import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { descendantIds, listCategoriesAdmin } from "@/lib/server/admin/categories";
import { Card, PageHeader } from "@/components/admin/ui";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteCategoryAction } from "@/app/admin/_actions/categories";
import { buttonClass } from "@/components/ui/button-class";

export const metadata: Metadata = { title: "Edit category" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, categories] = await Promise.all([params, listCategoriesAdmin()]);
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const blocked = descendantIds(categories, category.id);

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.depth > 0 ? category.path : "Main category"}
        back={{ href: "/admin/categories", label: "All categories" }}
        actions={
          <Link href={`/collections/${category.slug}`} target="_blank" className={buttonClass("secondary")}>
            <ExternalLink className="h-5 w-5" aria-hidden="true" /> View on store
          </Link>
        }
      />
      <CategoryForm
        key={category.id}
        parentOptions={categories.filter((c) => !blocked.has(c.id)).map((c) => ({ id: c.id, label: c.path }))}
        initial={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          parent_id: category.parent_id,
          tagline: category.tagline,
          description: category.description,
          badge: category.badge,
          image_url: category.image_url,
          image_file_id: category.image_file_id,
          sort_order: category.sort_order,
          is_active: category.is_active,
          show_on_home: category.show_on_home,
        }}
      />
      <div className="mt-8">
        <Card title="Delete category" description="Only empty categories (no products or sub-categories) can be deleted.">
          <DeleteButton
            action={deleteCategoryAction}
            id={category.id}
            confirmText={`Delete the category “${category.name}”? This can't be undone.`}
            label="Delete category"
          />
        </Card>
      </div>
    </>
  );
}
