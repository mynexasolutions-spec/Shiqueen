"use server";

import { requireAdmin } from "@/lib/server/session";
import { getImageKitUploadAuth } from "@/lib/server/imagekit";

/** Signed, single-use ImageKit upload credentials — admins only. */
export async function getUploadAuth() {
  await requireAdmin();
  return getImageKitUploadAuth();
}
