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

export async function saveCategoryAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();

  const id = str(fd, "id", 40);
  const name = str(fd, "name", 120);
  const slug = slugify(str(fd, "slug", 120) || name);
  const parentRaw = str(fd, "parent_id", 40);
  const parentId = parentRaw && isUuid(parentRaw) ? parentRaw : null;
  const imageUrl = str(fd, "image_url", 1000);
  const imageFileId = str(fd, "image_file_id", 200);
  const sortOrder = Math.max(-9999, Math.min(9999, Math.floor(Number(fd.get("sort_order") ?? 0)) || 0));

  if (!name) return { error: "Please enter a category name." };
  if (!slug) return { error: "Please enter a valid URL slug (letters and numbers)." };
  if (!imageUrl) return { error: "Please upload a category image." };
  if (id && !isUuid(id)) return { error: "Invalid category." };

  if (parentId) {
    const [parent] = await sql`select id from categories where id = ${parentId}`;
    if (!parent) return { error: "The selected parent category no longer exists." };
    if (id) {
      // Reject moving a category under itself or one of its own sub-categories.
      const [cycle] = await sql`
        with recursive tree as (
          select id from categories where id = ${id}
          union all
          select c.id from categories c join tree t on c.parent_id = t.id
        ) select 1 from tree where id = ${parentId} limit 1`;
      if (cycle) return { error: "A category can't be placed inside itself or one of its sub-categories." };
    }
  }

  const values = {
    name,
    slug,
    parent_id: parentId,
    tagline: str(fd, "tagline", 200),
    description: str(fd, "description", 2000),
    badge: str(fd, "badge", 60),
    image_url: imageUrl,
    image_file_id: imageFileId,
    sort_order: sortOrder,
    is_active: fd.get("is_active") === "on",
    show_on_home: fd.get("show_on_home") === "on",
  };

  let newId: string | null = null;
  try {
    if (id) {
      const updated = await sql`
        update categories set ${sql(values)}, updated_at = now() where id = ${id} returning id`;
      if (!updated.length) return { error: "This category no longer exists." };
    } else {
      const [row] = await sql<{ id: string }[]>`insert into categories ${sql(values)} returning id`;
      newId = row.id;
    }
  } catch (err) {
    if ((err as { code?: string }).code === "23505") return { error: `The URL slug "${slug}" is already used by another category.` };
    console.error("[admin] saveCategory", err);
    return { error: "Could not save the category. Please try again." };
  }

  refreshStorefront();
  if (newId) redirect(`/admin/categories?saved=${encodeURIComponent(name)}`);
  refresh();
  return { message: "Category saved." };
}

export async function deleteCategoryAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  if (!isUuid(id)) return { error: "Invalid category." };

  const [counts] = await sql<{ children: number; products: number }[]>`
    select (select count(*)::int from categories where parent_id = ${id}) as children,
           (select count(*)::int from products where category_id = ${id}) as products`;
  if (counts.children > 0) return { error: `Move or delete its ${counts.children} sub-categor${counts.children === 1 ? "y" : "ies"} first.` };
  if (counts.products > 0) return { error: `Move its ${counts.products} product${counts.products === 1 ? "" : "s"} to another category first.` };

  await sql`delete from categories where id = ${id}`;
  refreshStorefront();
  redirect("/admin/categories?deleted=1");
}
