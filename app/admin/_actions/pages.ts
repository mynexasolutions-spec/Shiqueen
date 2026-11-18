"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { CONTENT_TAG } from "@/lib/server/content";
import { isUuid } from "@/lib/server/admin/categories";
import { slugify } from "@/lib/format";

export interface FormState {
  error?: string;
  message?: string;
}

export async function savePageAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const title = String(fd.get("title") ?? "").trim().slice(0, 150);
  const slug = slugify(String(fd.get("slug") ?? "") || title);
  const body = String(fd.get("body") ?? "").slice(0, 60000);
  const isPublished = fd.get("is_published") === "on";
  if (!title) return { error: "Please enter a title." };
  if (!slug) return { error: "Please enter a valid URL slug." };
  if (id && !isUuid(id)) return { error: "Invalid page." };

  let newId = "";
  try {
    if (id) {
      await sql`update pages set title = ${title}, slug = ${slug}, body = ${body}, is_published = ${isPublished}, updated_at = now() where id = ${id}`;
    } else {
      const [row] = await sql<{ id: string }[]>`insert into pages (title, slug, body, is_published) values (${title}, ${slug}, ${body}, ${isPublished}) returning id`;
      newId = row.id;
    }
  } catch (err) {
    if ((err as { code?: string }).code === "23505") return { error: `Another page already uses the address /pages/${slug}.` };
    throw err;
  }
  updateTag(CONTENT_TAG);
  if (newId) redirect(`/admin/pages/${newId}?created=1`);
  refresh();
  return { message: isPublished ? "Page saved and published." : "Page saved as a draft (not visible on the store)." };
}

export async function deletePageAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (!isUuid(id)) return { error: "Invalid page." };
  await sql`delete from pages where id = ${id}`;
  updateTag(CONTENT_TAG);
  redirect("/admin/pages?deleted=1");
}
