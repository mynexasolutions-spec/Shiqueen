"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { refreshStorefront } from "@/lib/server/revalidate";
import { isUuid } from "@/lib/server/admin/categories";
import { slugify } from "@/lib/format";

export interface FormState {
  error?: string;
  message?: string;
}

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);
const int = (fd: FormData, key: string) => {
  const raw = String(fd.get(key) ?? "").trim();
  if (raw === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.round(n) : NaN;
};

function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  try {
    const v = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const isSafeImageUrl = (u: string) => /^https:\/\/ik\.imagekit\.io\//.test(u) || /^\/images\/[\w\-/.]+$/.test(u);

export async function saveProductAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const id = str(fd, "id", 40);
  if (id && !isUuid(id)) return { error: "Invalid product." };

  const name = str(fd, "name", 200);
  const slug = slugify(str(fd, "slug", 200) || name);
  const price = int(fd, "price");
  const compareAt = int(fd, "compare_at_price");
  const stock = int(fd, "stock");
  const status = str(fd, "status", 20);
  const categoryRaw = str(fd, "category_id", 40);
  const categoryId = isUuid(categoryRaw) ? categoryRaw : null;

  if (!name) return { error: "Please enter a product name." };
  if (!slug) return { error: "Please enter a valid URL slug." };
  if (!Number.isFinite(price) || price < 0) return { error: "Please enter a valid selling price (whole rupees)." };
  if (!Number.isFinite(compareAt) || compareAt < 0) return { error: "Please enter a valid MRP / compare-at price." };
  if (compareAt > 0 && compareAt < price) return { error: "MRP should be higher than (or equal to) the selling price." };
  if (!Number.isFinite(stock)) return { error: "Please enter a valid stock quantity." };
  if (!["active", "draft", "archived"].includes(status)) return { error: "Please choose a status." };

  const images = parseJsonArray<{ url?: unknown; fileId?: unknown }>(fd.get("images"))
    .map((i) => ({ url: String(i?.url ?? ""), fileId: String(i?.fileId ?? "").slice(0, 200) }))
    .filter((i) => isSafeImageUrl(i.url))
    .slice(0, 12);
  if (status === "active" && images.length === 0) return { error: "Please upload at least one product image before publishing." };

  const specifications = parseJsonArray<{ label?: unknown; value?: unknown }>(fd.get("specifications"))
    .map((s) => ({ label: String(s?.label ?? "").trim().slice(0, 80), value: String(s?.value ?? "").trim().slice(0, 300) }))
    .filter((s) => s.label && s.value)
    .slice(0, 30);

  const features = str(fd, "features", 3000)
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 20);

  if (categoryId) {
    const [c] = await sql`select id from categories where id = ${categoryId}`;
    if (!c) return { error: "The selected category no longer exists." };
  }

  const values = {
    name,
    slug,
    category_id: categoryId,
    description: str(fd, "description", 10000),
    price,
    compare_at_price: compareAt,
    sku: str(fd, "sku", 80),
    stock,
    track_inventory: fd.get("track_inventory") === "on",
    status,
    is_featured: fd.get("is_featured") === "on",
    badge: str(fd, "badge", 60),
    plating: str(fd, "plating", 60) || "18K Gold Plated",
    material: str(fd, "material", 120),
    features,
    specifications: sql.json(specifications),
    finishes: [...new Set(fd.getAll("finishes").map((f) => String(f).trim().slice(0, 60)).filter(Boolean))].slice(0, 12),
    seo_title: str(fd, "seo_title", 200),
    seo_description: str(fd, "seo_description", 400),
  };

  let productId = id;
  try {
    await sql.begin(async (tx) => {
      if (id) {
        const updated = await tx`update products set ${tx(values)}, updated_at = now() where id = ${id} returning id`;
        if (!updated.length) throw new Error("NOT_FOUND");
        // Files stay in ImageKit: past orders keep pointing at the images they were bought with.
        await tx`delete from product_images where product_id = ${id}`;
      } else {
        const [row] = await tx<{ id: string }[]>`insert into products ${tx(values)} returning id`;
        productId = row.id;
      }
      for (const [i, img] of images.entries()) {
        await tx`insert into product_images (product_id, url, file_id, alt, sort_order) values (${productId}, ${img.url}, ${img.fileId}, ${name}, ${i})`;
      }
    });
  } catch (err) {
    if ((err as Error).message === "NOT_FOUND") return { error: "This product no longer exists." };
    if ((err as { code?: string }).code === "23505") return { error: `The URL slug "${slug}" is already used by another product.` };
    console.error("[admin] saveProduct", err);
    return { error: "Could not save the product. Please try again." };
  }

  refreshStorefront();
  if (!id) redirect(`/admin/products/${productId}?created=1`);
  refresh();
  return { message: "Product saved." };
}

export async function deleteProductAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  if (!isUuid(id)) return { error: "Invalid product." };
  // Past orders keep their own copy of name/price/image, so history survives the deletion.
  await sql`delete from products where id = ${id}`;
  refreshStorefront();
  redirect("/admin/products?deleted=1");
}
