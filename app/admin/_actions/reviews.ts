"use server";

import { refresh } from "next/cache";
import { sql } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { refreshStorefront } from "@/lib/server/revalidate";
import { isUuid } from "@/lib/server/admin/categories";

export interface FormState {
  error?: string;
  message?: string;
}

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? "").trim().slice(0, max);

/** One action for all moderation buttons: approve, hide, feature, unfeature, reply, delete. */
export async function moderateReviewAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const op = str(fd, "op", 20);
  if (!isUuid(id)) return { error: "Invalid review." };

  let message = "";
  switch (op) {
    case "approve":
      await sql`update reviews set status = 'approved', updated_at = now() where id = ${id}`;
      message = "Review approved and now visible.";
      break;
    case "hide":
      await sql`update reviews set status = 'hidden', is_featured = false, updated_at = now() where id = ${id}`;
      message = "Review hidden from the store.";
      break;
    case "feature":
      await sql`update reviews set is_featured = true, status = 'approved', updated_at = now() where id = ${id}`;
      message = "Review featured on the homepage.";
      break;
    case "unfeature":
      await sql`update reviews set is_featured = false, updated_at = now() where id = ${id}`;
      message = "Removed from the homepage.";
      break;
    case "reply":
      await sql`update reviews set admin_reply = ${str(fd, "reply", 1500)}, updated_at = now() where id = ${id}`;
      message = "Reply saved.";
      break;
    case "delete":
      await sql`delete from reviews where id = ${id}`;
      message = "Review deleted.";
      break;
    default:
      return { error: "Unknown action." };
  }
  refreshStorefront();
  refresh();
  return { message };
}
