import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "./db";
import {
  getProductSpecifications,
  type CatalogProduct,
  type CollectionMeta,
  type ProductSpecItem,
} from "@/lib/collections-data";

/** Every storefront read is tagged with this; admin mutations call updateTag(CATALOG_TAG). */
export const CATALOG_TAG = "catalog";

const PLACEHOLDER_IMAGE = "/images/shiqueen-logo-2026b.png";

interface CategoryRow {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  badge: string;
  image_url: string;
  sort_order: number;
  show_on_home: boolean;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string;
  price: number;
  compare_at_price: number;
  stock: number;
  track_inventory: boolean;
  is_featured: boolean;
  badge: string;
  plating: string;
  material: string;
  features: string[];
  specifications: ProductSpecItem[];
  finishes: string[];
  rating: number;
  review_count: number;
  images: string[];
  created_at: Date;
}

/** One cached snapshot of the active catalogue (small store → one query pair). */
async function loadCatalog() {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("days");

  const categories = await sql<CategoryRow[]>`
    select id, parent_id, name, slug, tagline, description, badge, image_url, sort_order, show_on_home
    from categories where is_active
    order by sort_order, name`;

  const products = await sql<ProductRow[]>`
    select p.id, p.name, p.slug, p.category_id, p.description, p.price, p.compare_at_price, p.stock,
           p.track_inventory, p.is_featured, p.badge, p.plating, p.material, p.features, p.specifications,
           p.finishes, p.created_at,
           coalesce((select round(avg(r.rating)::numeric, 1)::float8 from reviews r where r.product_id = p.id and r.status = 'approved'), 0) as rating,
           (select count(*)::int from reviews r where r.product_id = p.id and r.status = 'approved') as review_count,
           coalesce((select array_agg(i.url order by i.sort_order, i.created_at) from product_images i where i.product_id = p.id), '{}') as images
    from products p
    where p.status = 'active'
    order by p.is_featured desc, p.created_at desc`;

  // Plain, serialisable copies.
  return {
    categories: categories.map((c) => ({ ...c })),
    products: products.map((p) => ({ ...p, created_at: new Date(p.created_at) })),
  };
}

type Catalog = Awaited<ReturnType<typeof loadCatalog>>;

function indexCatalog(catalog: Catalog) {
  const byId = new Map(catalog.categories.map((c) => [c.id, c]));
  const bySlug = new Map(catalog.categories.map((c) => [c.slug, c]));
  const children = new Map<string | null, CategoryRow[]>();
  for (const c of catalog.categories) {
    // A category whose parent is inactive is hidden along with its parent.
    if (c.parent_id && !byId.has(c.parent_id)) continue;
    const list = children.get(c.parent_id) ?? [];
    list.push(c);
    children.set(c.parent_id, list);
  }
  /** Path from top-level down to the category (inclusive); empty if any ancestor is hidden. */
  const pathOf = (id: string | null): CategoryRow[] => {
    const path: CategoryRow[] = [];
    const seen = new Set<string>();
    let cur = id ? byId.get(id) : undefined;
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      path.unshift(cur);
      if (!cur.parent_id) return path;
      cur = byId.get(cur.parent_id);
    }
    return [];
  };
  return { byId, bySlug, children, pathOf };
}

function toCatalogProduct(p: ProductRow, path: CategoryRow[], subcategory = ""): CatalogProduct {
  const images = p.images.length ? p.images : [PLACEHOLDER_IMAGE];
  const product: CatalogProduct = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    collectionSlug: path[0]?.slug ?? "",
    subcategory,
    primaryImage: images[0],
    hoverImage: images[1] ?? images[0],
    images,
    price: p.price,
    originalPrice: Math.max(p.compare_at_price, p.price),
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.review_count,
    inStock: !p.track_inventory || p.stock > 0,
    plating: p.plating || "18K Gold Plated",
    finishes: p.finishes?.length ? p.finishes : [p.plating || "18K Gold Plated"],
    material: p.material,
    features: p.features ?? [],
    description: p.description,
    categoryName: path[path.length - 1]?.name ?? "",
  };
  const specs = Array.isArray(p.specifications) ? p.specifications.filter((s) => s?.label && s?.value) : [];
  product.specifications = specs.length ? specs : getProductSpecifications(product);
  return product;
}

function toCollectionMeta(c: CategoryRow, kids: CategoryRow[], ancestors: CategoryRow[], fallbackImage?: string): CollectionMeta {
  return {
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    badge: c.badge,
    bannerImage: c.image_url || fallbackImage || PLACEHOLDER_IMAGE,
    subcategories: kids.length ? ["All", ...kids.map((k) => k.name)] : [],
    ancestors: ancestors.map((a) => ({ slug: a.slug, name: a.name })),
  };
}

// ───────────────────────── Public API ─────────────────────────

export interface HomeCategory {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export async function getHomeCategories(): Promise<HomeCategory[]> {
  const catalog = await loadCatalog();
  const { children } = indexCatalog(catalog);
  return (children.get(null) ?? [])
    .filter((c) => c.show_on_home)
    .map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline, image: c.image_url || PLACEHOLDER_IMAGE }));
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const catalog = await loadCatalog();
  return catalog.categories.map((c) => c.slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const catalog = await loadCatalog();
  return catalog.products.map((p) => p.slug);
}

/** A category page: the category, its direct children as filter chips, and every product in its subtree. */
export async function getCollectionPageData(slug: string) {
  const catalog = await loadCatalog();
  const { bySlug, children, pathOf } = indexCatalog(catalog);
  const category = bySlug.get(slug);
  if (!category) return null;
  const path = pathOf(category.id);
  if (!path.length) return null; // hidden ancestor

  const kids = children.get(category.id) ?? [];
  const depth = path.length; // index of the direct child within a product's path

  const products: CatalogProduct[] = [];
  for (const p of catalog.products) {
    const pPath = pathOf(p.category_id);
    if (!pPath.some((c) => c.id === category.id)) continue;
    products.push(toCatalogProduct(p, pPath, pPath[depth]?.name ?? ""));
  }

  return {
    collection: toCollectionMeta(category, kids, path.slice(0, -1), products[0]?.primaryImage),
    products,
  };
}

export async function getProductPageData(slug: string) {
  const catalog = await loadCatalog();
  const { pathOf, children } = indexCatalog(catalog);
  const row = catalog.products.find((p) => p.slug === slug);
  if (!row) return null;
  const path = pathOf(row.category_id);
  const product = toCatalogProduct(row, path, path[1]?.name ?? "");
  const own = path[path.length - 1];
  const collection = own ? toCollectionMeta(own, children.get(own.id) ?? [], path.slice(0, -1)) : undefined;

  // Related: same deepest category first, then same top-level, then anything else.
  const scored = catalog.products
    .filter((p) => p.id !== row.id)
    .map((p) => {
      const pp = pathOf(p.category_id);
      const score = p.category_id === row.category_id ? 2 : pp[0] && pp[0].id === path[0]?.id ? 1 : 0;
      return { p, pp, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    product,
    collection,
    specifications: product.specifications ?? [],
    relatedProducts: scored.map(({ p, pp }) => toCatalogProduct(p, pp)),
  };
}

export interface ShowcaseTab {
  slug: string;
  name: string;
}

/** Homepage "bestsellers" slider: featured products (or newest), plus tabs for their top-level categories. */
export async function getShowcaseData(limit = 12): Promise<{ products: CatalogProduct[]; tabs: ShowcaseTab[] }> {
  const catalog = await loadCatalog();
  const { pathOf } = indexCatalog(catalog);
  const featured = catalog.products.filter((p) => p.is_featured);
  const list = (featured.length ? featured : catalog.products).slice(0, limit);
  const products = list.map((p) => toCatalogProduct(p, pathOf(p.category_id)));

  const tabs: ShowcaseTab[] = [];
  for (const p of products) {
    const top = pathOf(catalog.products.find((r) => r.id === p.id)?.category_id ?? null)[0];
    if (top && !tabs.some((t) => t.slug === top.slug)) tabs.push({ slug: top.slug, name: top.name });
  }
  return { products, tabs };
}
