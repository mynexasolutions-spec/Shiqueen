"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Alert, Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/ui/form";
import { Card } from "@/components/admin/ui";
import { MultiImageUpload, type UploadedImage } from "@/components/admin/ImageUpload";
import { saveProductAction } from "@/app/admin/_actions/products";
import { slugify } from "@/lib/format";
import type { ProductDetail } from "@/lib/server/admin/products";

export type ProductFormValues = Omit<ProductDetail, "id"> & { id?: string };

const PLATING_PRESETS = ["18K Gold Plated", "Rose Gold", "Silver", "Antique Gold", "Two-Tone"];

export default function ProductForm({
  initial,
  categoryOptions,
  finishOptions,
}: {
  initial: ProductFormValues;
  categoryOptions: { id: string; label: string }[];
  finishOptions: { name: string; swatch: string }[];
}) {
  const initialFinishes = initial.finishes.length ? initial.finishes : [initial.plating];
  const [state, action, pending] = useActionState(saveProductAction, {});
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [images, setImages] = useState<UploadedImage[]>(initial.images);
  const [specs, setSpecs] = useState(initial.specifications.length ? initial.specifications : []);
  const [price, setPrice] = useState(String(initial.price || ""));
  const [mrp, setMrp] = useState(String(initial.compare_at_price || ""));
  const [trackInventory, setTrackInventory] = useState(initial.track_inventory);

  const p = Number(price);
  const m = Number(mrp);
  const discount = m > 0 && p > 0 && m > p ? Math.round(((m - p) / m) * 100) : 0;

  return (
    <form action={action} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="specifications" value={JSON.stringify(specs)} />

      <div className="space-y-6 xl:col-span-2">
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {state.message && <Alert tone="success">{state.message}</Alert>}

        <Card title="Product details">
          <div className="space-y-5">
            <Field label="Product name" htmlFor="name" required>
              <Input
                id="name"
                name="name"
                required
                maxLength={200}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="URL slug" htmlFor="slug" hint={<>shiqueen.in/products/<strong>{slug || "your-slug"}</strong></>}>
              <Input
                id="slug"
                name="slug"
                maxLength={200}
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
              />
            </Field>
            <Field label="Description" htmlFor="description">
              <Textarea id="description" name="description" rows={6} maxLength={10000} defaultValue={initial.description} />
            </Field>
          </div>
        </Card>

        <Card title="Images" description="Upload as many as you need. The first image is the main photo; the second shows on hover.">
          <MultiImageUpload images={images} onChange={setImages} folder="/shiqueen/products" />
        </Card>

        <Card title="Pricing">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Selling price (₹)" htmlFor="price" required>
              <Input id="price" name="price" type="number" inputMode="numeric" min={0} step={1} required value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field label="MRP / compare-at price (₹)" htmlFor="compare_at_price" hint={discount ? `Customers see ${discount}% off.` : "Shown with a strike-through when higher than the price."}>
              <Input id="compare_at_price" name="compare_at_price" type="number" inputMode="numeric" min={0} step={1} value={mrp} onChange={(e) => setMrp(e.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Inventory">
          <div className="space-y-5">
            <Checkbox
              name="track_inventory"
              checked={trackInventory}
              onChange={(e) => setTrackInventory(e.target.checked)}
              label="Track stock for this product"
              hint="When stock reaches 0 the product shows as sold out. Untick for made-to-order items."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Stock quantity" htmlFor="stock">
                <Input id="stock" name="stock" type="number" inputMode="numeric" step={1} defaultValue={initial.stock} disabled={!trackInventory} />
                {!trackInventory && <input type="hidden" name="stock" value={initial.stock} />}
              </Field>
              <Field label="SKU (optional)" htmlFor="sku">
                <Input id="sku" name="sku" maxLength={80} defaultValue={initial.sku} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Jewellery details">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Finish / plating" htmlFor="plating">
                <Input id="plating" name="plating" list="plating-presets" maxLength={60} defaultValue={initial.plating} />
                <datalist id="plating-presets">
                  {PLATING_PRESETS.map((pp) => (
                    <option key={pp} value={pp} />
                  ))}
                </datalist>
              </Field>
              <Field label="Base material" htmlFor="material">
                <Input id="material" name="material" maxLength={120} placeholder="e.g. 316L Stainless Steel" defaultValue={initial.material} />
              </Field>
            </div>
            <Field label="Badge" htmlFor="badge" hint="Optional label such as “Bestseller” or “New”.">
              <Input id="badge" name="badge" maxLength={60} defaultValue={initial.badge} />
            </Field>
            <Field label="Key features" htmlFor="features" hint="One per line.">
              <Textarea id="features" name="features" rows={4} defaultValue={initial.features.join("\n")} placeholder={"Everyday Wear Friendly\nLong-Lasting Anti-Tarnish"} />
            </Field>

            <div>
              <p className="mb-2 text-base font-semibold">Specifications</p>
              <p className="mb-3 text-[15px] text-[#171717]/65">
                Shown in the “Specifications” tab. Leave empty to use the standard specs.
              </p>
              <div className="space-y-3">
                {specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-[#EFE8DD] p-3 sm:grid-cols-[1fr_2fr_auto] sm:border-0 sm:p-0">
                    <Input
                      aria-label={`Specification ${i + 1} label`}
                      placeholder="Label, e.g. Size & Fit"
                      value={s.label}
                      onChange={(e) => setSpecs((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                    />
                    <Input
                      aria-label={`Specification ${i + 1} value`}
                      placeholder="Value"
                      value={s.value}
                      onChange={(e) => setSpecs((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs((prev) => prev.filter((_, j) => j !== i))}
                      aria-label="Remove specification"
                      className="flex h-12 items-center justify-center gap-2 rounded-xl px-3 text-[#B42318] hover:bg-[#FEF3F2]"
                    >
                      <Trash2 className="h-5 w-5" /> <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSpecs((prev) => [...prev, { label: "", value: "" }])}
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl border border-[#D9CFB8] bg-white px-4 text-base font-semibold hover:border-[#8C671A]"
              >
                <Plus className="h-5 w-5" /> Add specification
              </button>
            </div>
          </div>
        </Card>

        <Card title="Search engine listing" description="Optional. Defaults to the product name and description.">
          <div className="space-y-5">
            <Field label="Page title" htmlFor="seo_title">
              <Input id="seo_title" name="seo_title" maxLength={200} defaultValue={initial.seo_title} />
            </Field>
            <Field label="Meta description" htmlFor="seo_description">
              <Textarea id="seo_description" name="seo_description" rows={3} maxLength={400} defaultValue={initial.seo_description} />
            </Field>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card title="Status">
          <div className="space-y-4">
            <Field label="Product status" htmlFor="status" hint="Only active products are visible in the store.">
              <Select id="status" name="status" defaultValue={initial.status}>
                <option value="active">Active — visible in store</option>
                <option value="draft">Draft — hidden</option>
                <option value="archived">Archived — hidden</option>
              </Select>
            </Field>
            <Checkbox name="is_featured" defaultChecked={initial.is_featured} label="Feature on homepage" hint="Shows in the “Trending Bestsellers” section." />
          </div>
        </Card>

        <Card title="Category">
          <Field label="Category" htmlFor="category_id" hint="Pick the most specific sub-category. The product also appears in every parent category.">
            <Select id="category_id" name="category_id" defaultValue={initial.category_id ?? ""}>
              <option value="">Uncategorised</option>
              {categoryOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </Card>

        <Card title="Finishes offered" description="Customers pick one of these on the product page. Manage the list in Storefront → Product page.">
          <div className="space-y-2">
            {finishOptions.map((f) => (
              <label key={f.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5DEC9] bg-white p-3 hover:border-[#C59B27]">
                <input type="checkbox" name="finishes" value={f.name} defaultChecked={initialFinishes.includes(f.name)} className="h-5 w-5 accent-[#8C671A]" />
                <span className="h-6 w-6 shrink-0 rounded-full border border-black/15" style={{ background: f.swatch }} aria-hidden="true" />
                <span className="text-base font-medium">{f.name}</span>
              </label>
            ))}
            {finishOptions.length === 0 && <p className="text-base text-[#171717]/65">No finish options yet.</p>}
          </div>
        </Card>

        <div className="sticky bottom-4 z-10">
          <SubmitButton size="lg" className="w-full shadow-lg" pending={pending} pendingText="Saving…">
            {initial.id ? "Save product" : "Create product"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
