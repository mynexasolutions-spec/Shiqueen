"use server";

import { updateTag } from "next/cache";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { CONTENT_TAG } from "@/lib/server/content";
import { SECTION_BY_KEY } from "@/lib/content/schema";
import { sanitizeSection } from "@/lib/content/sanitize";
import type { ContentKey } from "@/lib/content/types";

export async function saveContentAction(
  key: string,
  json: string
): Promise<{ error?: string; message?: string; saved?: Record<string, unknown> }> {
  await requireAdmin();
  const def = SECTION_BY_KEY[key as ContentKey];
  if (!def) return { error: "Unknown section." };
  if (json.length > 500_000) return { error: "This section is too large to save." };

  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { error: "Could not read the changes. Please reload and try again." };
  }

  const clean = sanitizeSection(def, raw);

  // Light validation for the gift customizer's short codes.
  if (key === "gifting") {
    const g = clean as { gift_types: { key: string }[]; occasions: { key: string }[] };
    for (const list of [g.gift_types, g.occasions]) {
      for (const item of list) item.key = item.key.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    }
  }

  await sql`insert into settings (key, value, updated_at) values (${`content.${key}`}, ${sql.json(clean as never)}, now())
            on conflict (key) do update set value = excluded.value, updated_at = now()`;
  updateTag(CONTENT_TAG);
  return { message: `${def.title} saved. The store is updated.`, saved: clean };
}
