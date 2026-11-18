import type { Metadata } from "next";
import { listCategoriesAdmin } from "@/lib/server/admin/categories";
import { PageHeader } from "@/components/admin/ui";
import CategoryForm from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "New category" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function NewCategoryPage({ searchParams }: { searchParams: Promise<{ parent?: string }> }) {
  const [categories, sp] = await Promise.all([listCategoriesAdmin(), searchParams]);
  const parent = categories.find((c) => c.id === sp.parent);

  return (
    <>
      <PageHeader
        title={parent ? `New sub-category` : "New category"}
        description={parent ? <>Inside <strong>{parent.path}</strong></> : "Create a main category or nest it under another one."}
        back={{ href: "/admin/categories", label: "All categories" }}
      />
      <CategoryForm
        parentOptions={categories.map((c) => ({ id: c.id, label: c.path }))}
        initial={{
          name: "",
          slug: "",
          parent_id: parent?.id ?? null,
          tagline: "",
          description: "",
          badge: "",
          image_url: "",
          image_file_id: "",
          sort_order: 0,
          is_active: true,
          show_on_home: !parent,
        }}
      />
    </>
  );
}
