import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";
import { isUuid } from "./categories";

export const PAGE_SIZE = 20;

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number;
  stock: number;
  track_inventory: boolean;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  category_name: string | null;
  image: string | null;
  image_count: number;
}

export async function listProductsAdmin(opts: { q?: string; status?: string; category?: string; stock?: string; page?: number }) {
  await requireAdmin();
  const page = Math.max(1, Math.floor(opts.page ?? 1) || 1);
  const q = (opts.q ?? "").trim().slice(0, 100);
  const status = ["active", "draft", "archived"].includes(opts.status ?? "") ? opts.status! : "";
  const category = isUuid(opts.category) ? opts.category : "";
  const stock = opts.stock === "low" || opts.stock === "out" ? opts.stock : "";

  const like = `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
  const where = sql`
    where true
    ${q ? sql`and (p.name ilike ${like} or p.slug ilike ${like} or p.sku ilike ${like})` : sql``}
    ${status ? sql`and p.status = ${status}` : sql``}
    ${
      category
        ? sql`and p.category_id in (
            with recursive tree as (
              select id from categories where id = ${category}
              union all select c.id from categories c join tree t on c.parent_id = t.id
            ) select id from tree)`
        : sql``
    }
    ${stock === "out" ? sql`and p.track_inventory and p.stock <= 0` : sql``}
    ${stock === "low" ? sql`and p.track_inventory and p.stock > 0 and p.stock <= (select coalesce((select (value #>> '{}')::int from settings where key = 'low_stock_threshold'), 5))` : sql``}
  `;

  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from products p ${where}`;
  const items = await sql<ProductListItem[]>`
    select p.id, p.name, p.slug, p.price, p.compare_at_price, p.stock, p.track_inventory, p.status, p.is_featured,
           c.name as category_name,
           (select i.url from product_images i where i.product_id = p.id order by i.sort_order, i.created_at limit 1) as image,
           (select count(*)::int from product_images i where i.product_id = p.id) as image_count
    from products p left join categories c on c.id = p.category_id
    ${where}
    order by p.updated_at desc
    limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`;

  return { items: items.map((i) => ({ ...i })), total: count, page, totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)) };
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string;
  price: number;
  compare_at_price: number;
  sku: string;
  stock: number;
  track_inventory: boolean;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  badge: string;
  plating: string;
  material: string;
  features: string[];
  specifications: { label: string; value: string }[];
  finishes: string[];
  seo_title: string;
  seo_description: string;
  images: { url: string; fileId: string }[];
}

export async function getProductAdmin(id: string): Promise<ProductDetail | null> {
  await requireAdmin();
  if (!isUuid(id)) return null;
  const [p] = await sql<Omit<ProductDetail, "images">[]>`
    select id, name, slug, category_id, description, price, compare_at_price, sku, stock, track_inventory, status,
           is_featured, badge, plating, material, features, specifications, finishes,
           seo_title, seo_description
    from products where id = ${id}`;
  if (!p) return null;
  const images = await sql<{ url: string; fileId: string }[]>`
    select url, file_id as "fileId" from product_images where product_id = ${id} order by sort_order, created_at`;
  return { ...p, specifications: Array.isArray(p.specifications) ? p.specifications : [], images: images.map((i) => ({ ...i })) };
}
