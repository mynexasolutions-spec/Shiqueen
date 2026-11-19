import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ImageOff, Package, Pencil, Plus } from "lucide-react";
import { listProductsAdmin } from "@/lib/server/admin/products";
import { listCategoriesAdmin } from "@/lib/server/admin/categories";
import { getSettings } from "@/lib/server/settings";
import { Badge, Card, EmptyState, FilterSelect, PageHeader, Pagination, SearchBar, withParams } from "@/components/admin/ui";
import { Alert } from "@/components/ui/form";
import { buttonClass } from "@/components/ui/button-class";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProductAction } from "@/app/admin/_actions/products";
import { inr } from "@/lib/format";

export const metadata: Metadata = { title: "Products" };

type SP = Record<string, string | undefined>;

function StockBadge({ stock, track, low }: { stock: number; track: boolean; low: number }) {
  if (!track) return <Badge tone="neutral">Not tracked</Badge>;
  if (stock <= 0) return <Badge tone="red">Out of stock</Badge>;
  if (stock <= low) return <Badge tone="amber">{stock} left</Badge>;
  return <Badge tone="green">{stock} in stock</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  return status === "active" ? <Badge tone="green">Active</Badge> : status === "draft" ? <Badge tone="amber">Draft</Badge> : <Badge tone="neutral">Archived</Badge>;
}

function Thumb({ src }: { src: string | null }) {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF7F2]">
      {src ? <Image src={src} alt="" fill sizes="64px" className="object-cover" /> : <ImageOff className="m-auto h-full w-6 text-[#171717]/30" />}
    </div>
  );
}

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters = { q: sp.q, status: sp.status, category: sp.category, stock: sp.stock };
  const [data, categories, settings] = await Promise.all([
    listProductsAdmin({ ...filters, page: Number(sp.page ?? 1) }),
    listCategoriesAdmin(),
    getSettings(),
  ]);
  const low = settings.low_stock_threshold;
  const hasFilters = Boolean(sp.q || sp.status || sp.category || sp.stock);

  return (
    <>
      <PageHeader
        title="Products"
        description={`${data.total} product${data.total === 1 ? "" : "s"}${hasFilters ? " match your filters" : ""}`}
        actions={
          <Link href="/admin/products/new" className={buttonClass("primary")}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Add product
          </Link>
        }
      />

      {sp.deleted && (
        <div className="mb-5">
          <Alert tone="success">Product deleted.</Alert>
        </div>
      )}

      <div className="mb-5">
        <SearchBar action="/admin/products" q={sp.q} placeholder="Search by name, slug or SKU">
          <FilterSelect
            name="category"
            label="Category"
            value={sp.category}
            options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c.id, label: c.path }))]}
          />
          <FilterSelect
            name="status"
            label="Status"
            value={sp.status}
            options={[
              { value: "", label: "Any status" },
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
            ]}
          />
          <FilterSelect
            name="stock"
            label="Stock"
            value={sp.stock}
            options={[
              { value: "", label: "Any stock" },
              { value: "low", label: "Low stock" },
              { value: "out", label: "Out of stock" },
            ]}
          />
        </SearchBar>
        {hasFilters && (
          <Link href="/admin/products" className="mt-3 inline-block text-base font-semibold text-[#8C671A] hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      <Card padded={false}>
        {data.items.length === 0 ? (
          <EmptyState
            icon={<Package className="h-8 w-8" />}
            title={hasFilters ? "No products match" : "No products yet"}
            body={hasFilters ? "Try a different search or clear the filters." : "Add your first product to start selling."}
            action={
              !hasFilters && (
                <Link href="/admin/products/new" className={buttonClass("primary")}>
                  Add product
                </Link>
              )
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-base">
                <thead className="border-b border-[#EFE8DD] bg-[#FDFBF7] text-[15px] text-[#171717]/65">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Product</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold">Stock</th>
                    <th className="px-4 py-3.5 font-semibold">Category</th>
                    <th className="px-6 py-3.5 text-right font-semibold">Price</th>
                    <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DD]">
                  {data.items.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FDFBF7]">
                      <td className="px-6 py-3">
                        <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4">
                          <Thumb src={p.image} />
                          <span className="min-w-0">
                            <span className="block font-semibold text-[#171717] hover:text-[#8C671A]">{p.name}</span>
                            <span className="text-[15px] text-[#171717]/55">
                              {p.image_count} image{p.image_count === 1 ? "" : "s"}
                              {p.is_featured ? " · ★ Featured" : ""}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3">
                        <StockBadge stock={p.stock} track={p.track_inventory} low={low} />
                      </td>
                      <td className="px-4 py-3 text-[#171717]/75">{p.category_name ?? "—"}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-right">
                        <span className="font-semibold">{inr(p.price)}</span>
                        {p.compare_at_price > p.price && <span className="ml-2 text-[15px] text-[#171717]/50 line-through">{inr(p.compare_at_price)}</span>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/products/${p.id}`} className={buttonClass("secondary", "sm")}>
                            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                          </Link>
                          <DeleteButton
                            action={deleteProductAction}
                            id={p.id}
                            confirmText={`Delete “${p.name}”? This can't be undone.`}
                            label="Delete"
                            size="sm"
                            variant="secondary"
                            className="border-[#F4C7C3] text-[#912018] hover:border-[#B42318] hover:bg-[#FEF3F2] hover:text-[#912018]"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-[#EFE8DD] md:hidden">
              {data.items.map((p) => (
                <li key={p.id} className="p-4">
                  <div className="flex gap-4">
                    <Thumb src={p.image} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/admin/products/${p.id}`} className="block font-semibold text-[#171717] hover:text-[#8C671A]">
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-base">
                        <span className="font-semibold">{inr(p.price)}</span>
                        {p.compare_at_price > p.price && (
                          <span className="ml-2 text-[14px] text-[#171717]/50 line-through">{inr(p.compare_at_price)}</span>
                        )}
                        {p.category_name && <span className="text-[#171717]/60"> · {p.category_name}</span>}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge status={p.status} />
                        <StockBadge stock={p.stock} track={p.track_inventory} low={low} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#EFE8DD] pt-3">
                    <Link href={`/admin/products/${p.id}`} className={buttonClass("secondary", "sm")}>
                      <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                    </Link>
                    <DeleteButton
                      action={deleteProductAction}
                      id={p.id}
                      confirmText={`Delete “${p.name}”? This can't be undone.`}
                      label="Delete"
                      size="sm"
                      variant="secondary"
                      className="border-[#F4C7C3] text-[#912018] hover:border-[#B42318] hover:bg-[#FEF3F2] hover:text-[#912018]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Pagination page={data.page} totalPages={data.totalPages} hrefFor={(p) => withParams("/admin/products", { ...filters, page: p })} />
    </>
  );
}
