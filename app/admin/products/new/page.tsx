import type { Metadata } from "next";
import { listCategoriesAdmin } from "@/lib/server/admin/categories";
import { readContent } from "@/lib/server/content";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function NewProductPage() {
  const [categories, content] = await Promise.all([listCategoriesAdmin(), readContent()]);
  return (
    <>
      <PageHeader title="New product" back={{ href: "/admin/products", label: "All products" }} />
      <ProductForm
        categoryOptions={categories.map((c) => ({ id: c.id, label: c.path }))}
        finishOptions={content.product_page.finish_options}
        initial={{
          name: "",
          slug: "",
          category_id: null,
          description: "",
          price: 0,
          compare_at_price: 0,
          sku: "",
          stock: 10,
          track_inventory: true,
          status: "active",
          is_featured: false,
          badge: "",
          plating: "18K Gold Plated",
          material: "316L Stainless Steel",
          features: [],
          specifications: [],
          finishes: content.product_page.finish_options.slice(0, 1).map((f) => f.name),
          seo_title: "",
          seo_description: "",
          images: [],
        }}
      />
    </>
  );
}
