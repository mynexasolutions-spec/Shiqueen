"use server";

import { updateTag } from "next/cache";
import { sql } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";
import { getSettings } from "@/lib/server/settings";
import { CATALOG_TAG } from "@/lib/server/catalog";
import { CONTENT_TAG } from "@/lib/server/content";
import { isUuid } from "@/lib/server/admin/categories";

export interface ReviewStatus {
  enabled: boolean;
  signedIn: boolean;
  canReview: boolean;
  reason?: string;
  name?: string;
  existing?: { rating: number; title: string; body: string; location: string; status: string };
}

async function hasPurchased(userId: string, email: string, productId: string) {
  const [row] = await sql`
    select 1 from order_items i join orders o on o.id = i.order_id
    where i.product_id = ${productId} and o.status not in ('cancelled', 'returned')
      and (o.user_id = ${userId} or o.email = ${email})
    limit 1`;
  return Boolean(row);
}

/** Whether the visitor can review this product (called when the review form opens). */
export async function getReviewStatus(productId: string): Promise<ReviewStatus> {
  const settings = await getSettings();
  if (!settings.reviews_enabled) return { enabled: false, signedIn: false, canReview: false, reason: "Reviews are currently closed." };
  const user = await getCurrentUser();
  if (!user) return { enabled: true, signedIn: false, canReview: false };
  if (!isUuid(productId)) return { enabled: true, signedIn: true, canReview: false, reason: "Product not found." };

  const [existing] = await sql<{ rating: number; title: string; body: string; location: string; status: string }[]>`
    select rating, title, body, location, status from reviews where product_id = ${productId} and user_id = ${user.id}`;
  if (settings.reviews_buyers_only && !(await hasPurchased(user.id, user.email, productId))) {
    return { enabled: true, signedIn: true, canReview: false, name: user.name, reason: "Only customers who bought this product can review it." };
  }
  return { enabled: true, signedIn: true, canReview: true, name: user.name, existing: existing ? { ...existing } : undefined };
}

export type SubmitReviewResult = { ok: true; message: string } | { ok: false; error: string };

export async function submitReview(input: {
  productId: string;
  rating: number;
  title: string;
  body: string;
  location: string;
  name: string;
}): Promise<SubmitReviewResult> {
  const settings = await getSettings();
  if (!settings.reviews_enabled) return { ok: false, error: "Reviews are currently closed." };
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to write a review." };
  if (!isUuid(input.productId)) return { ok: false, error: "Product not found." };

  const rating = Math.round(Number(input.rating));
  const body = String(input.body ?? "").trim().slice(0, 2000);
  const title = String(input.title ?? "").trim().slice(0, 120);
  const location = String(input.location ?? "").trim().slice(0, 60);
  const name = (String(input.name ?? "").trim() || user.name || "Customer").slice(0, 60);
  if (!(rating >= 1 && rating <= 5)) return { ok: false, error: "Please choose a star rating." };
  if (body.length < 10) return { ok: false, error: "Please write at least a sentence about the product." };

  const [product] = await sql`select id from products where id = ${input.productId} and status = 'active'`;
  if (!product) return { ok: false, error: "Product not found." };

  const verified = await hasPurchased(user.id, user.email, input.productId);
  if (settings.reviews_buyers_only && !verified) return { ok: false, error: "Only customers who bought this product can review it." };

  const status = settings.reviews_require_approval ? "pending" : "approved";
  // One review per customer per product; editing resubmits it.
  await sql`
    insert into reviews (product_id, user_id, author_name, location, rating, title, body, status, verified_purchase)
    values (${input.productId}, ${user.id}, ${name}, ${location}, ${rating}, ${title}, ${body}, ${status}, ${verified})
    on conflict (product_id, user_id) where user_id is not null do update
      set author_name = excluded.author_name, location = excluded.location, rating = excluded.rating,
          title = excluded.title, body = excluded.body, status = excluded.status,
          verified_purchase = excluded.verified_purchase, updated_at = now()`;

  if (status === "approved") {
    updateTag(CATALOG_TAG);
    updateTag(CONTENT_TAG);
  }
  return {
    ok: true,
    message:
      status === "pending"
        ? "Thank you! Your review has been received and will appear once it's approved."
        : "Thank you! Your review is now live.",
  };
}
