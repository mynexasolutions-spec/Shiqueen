import "server-only";
import { updateTag } from "next/cache";
import { CATALOG_TAG } from "./catalog";
import { CONTENT_TAG } from "./content";

/** Call from Server Actions after any catalogue change (products, categories, stock, reviews). */
export function refreshStorefront() {
  updateTag(CATALOG_TAG);
  updateTag(CONTENT_TAG);
}
