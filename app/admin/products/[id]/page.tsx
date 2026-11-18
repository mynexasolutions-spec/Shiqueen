import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getProductAdmin } from "@/lib/server/admin/products";
import { listCategoriesAdmin } from "@/lib/server/admin/categories";
import { readContent } from "@/lib/server/content";
import { Card, PageHeader } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProductAction } from "@/app/admin/_actions/products";
import { Alert } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/button-class";

export const metadata: Metadata = { title: "Edit product" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [product, categories, content] = await Promise.all([getProductAdmin(id), listCategoriesAdmin(), readContent()]);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title={product.name}
        back={{ href: "/admin/products", label: "All products" }}
        actions={
          product.status === "active" && (
            <Link href={`/products/${product.slug}`} target="_blank" className={buttonClass("secondary")}>
              <ExternalLink className="h-5 w-5" aria-hidden="true" /> View on store
            </Link>
          )
        }
      />
      {sp.created && (
        <div className="mb-6">
          <Alert tone="success">Product created. You can keep editing it below.</Alert>
        </div>
      )}
      <ProductForm
        key={product.id}
        categoryOptions={categories.map((c) => ({ id: c.id, label: c.path }))}
        finishOptions={content.product_page.finish_options}
        initial={product}
      />
      <div className="mt-8">
        <Card title="Delete product" description="Removes it from the store. Past orders keep their item details.">
          <DeleteButton action={deleteProductAction} id={product.id} confirmText={`Delete “${product.name}”? This can't be undone.`} label="Delete product" />
        </Card>
      </div>
    </>
  );
}
