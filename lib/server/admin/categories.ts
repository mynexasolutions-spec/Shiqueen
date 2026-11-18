import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";

export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export interface AdminCategory {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  badge: string;
  image_url: string;
  image_file_id: string;
  sort_order: number;
  is_active: boolean;
  show_on_home: boolean;
  product_count: number;
  child_count: number;
  depth: number;
  path: string; // "Necklaces › Layered"
}

/** All categories in tree order (parents first, children indented), with counts. */
export async function listCategoriesAdmin(): Promise<AdminCategory[]> {
  await requireAdmin();
  const rows = await sql<Omit<AdminCategory, "depth" | "path">[]>`
    select c.id, c.parent_id, c.name, c.slug, c.tagline, c.description, c.badge, c.image_url, c.image_file_id,
           c.sort_order, c.is_active, c.show_on_home,
           (select count(*)::int from products p where p.category_id = c.id) as product_count,
           (select count(*)::int from categories k where k.parent_id = c.id) as child_count
    from categories c
    order by c.sort_order, c.name`;

  type Row = Omit<AdminCategory, "depth" | "path">;
  const byParent = new Map<string | null, Row[]>();
  for (const r of rows) {
    const list = byParent.get(r.parent_id) ?? [];
    list.push(r);
    byParent.set(r.parent_id, list);
  }
  const out: AdminCategory[] = [];
  const seen = new Set<string>();
  const walk = (parent: string | null, depth: number, prefix: string) => {
    for (const r of byParent.get(parent) ?? []) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      const path = prefix ? `${prefix} › ${r.name}` : r.name;
      out.push({ ...r, depth, path });
      walk(r.id, depth + 1, path);
    }
  };
  walk(null, 0, "");
  // Orphans (shouldn't happen) are appended so nothing is hidden from the admin.
  for (const r of rows) if (!seen.has(r.id)) out.push({ ...r, depth: 0, path: r.name });
  return out;
}

export async function getCategoryAdmin(id: string) {
  await requireAdmin();
  if (!isUuid(id)) return null;
  const all = await listCategoriesAdmin();
  return all.find((c) => c.id === id) ?? null;
}

/** IDs of a category and all its descendants (to prevent cycles when choosing a parent). */
export function descendantIds(all: AdminCategory[], id: string): Set<string> {
  const out = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of all) {
      if (c.parent_id && out.has(c.parent_id) && !out.has(c.id)) {
        out.add(c.id);
        grew = true;
      }
    }
  }
  return out;
}
