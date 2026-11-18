import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "./db";
import { requireAdmin } from "./session";
import { CONTENT_TAG } from "./content";

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  body: string;
  is_published: boolean;
  updated_at: Date;
}

export async function getPublishedPage(slug: string): Promise<SitePage | null> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  const [p] = await sql<SitePage[]>`select id, slug, title, body, is_published, updated_at from pages where slug = ${slug} and is_published`;
  return p ? { ...p } : null;
}

export async function getPublishedPageSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  const rows = await sql<{ slug: string }[]>`select slug from pages where is_published`;
  return rows.map((r) => r.slug);
}

export async function listPagesAdmin(): Promise<SitePage[]> {
  await requireAdmin();
  const rows = await sql<SitePage[]>`select id, slug, title, body, is_published, updated_at from pages order by title`;
  return rows.map((r) => ({ ...r }));
}
