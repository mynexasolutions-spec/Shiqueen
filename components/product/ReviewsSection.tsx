"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getReviewStatus, submitReview, type ReviewStatus } from "@/app/products/review-actions";
import type { PublicReview } from "@/lib/site-types";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-4.5 w-4.5" : "h-3.5 w-3.5";
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`${cls} ${i <= Math.round(rating) ? "text-[#C59B27]" : "text-[#E5DEC9]"}`} fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "★";

function ReviewCard({ rev, showProduct }: { rev: PublicReview; showProduct: boolean }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/60 p-4 sm:p-5 xl:p-6">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE8E4] font-serif text-sm font-bold text-[#8C671A]">
              {initials(rev.author)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-bold text-[#111111]">{rev.author}</span>
                {rev.verified && (
                  <span className="whitespace-nowrap rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#137333]">
                    ✓ Verified buyer
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-[#171717]/65">
                {[rev.location, fmtDate(rev.date)].filter(Boolean).join(" • ")}
              </p>
            </div>
          </div>
          <Stars rating={rev.rating} />
        </div>
        {rev.title && <h3 className="mt-3 text-sm font-bold text-[#111111] xl:text-base">{rev.title}</h3>}
        <p className="mt-1.5 whitespace-pre-line text-[13px] font-medium leading-relaxed text-[#171717]/80 xl:text-sm">{rev.body}</p>
        {rev.reply && (
          <div className="mt-3 rounded-xl border-l-4 border-[#C59B27] bg-white px-3.5 py-2.5 text-[13px] text-[#171717]/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C671A]">Reply from the store</p>
            <p className="mt-0.5 whitespace-pre-line">{rev.reply}</p>
          </div>
        )}
      </div>
      {showProduct && (
        <Link href={`/products/${rev.product_slug}`} className="mt-4 flex items-center gap-2 rounded-xl border border-[#E5DEC9] bg-white px-3 py-2 hover:border-[#8C671A]">
          {rev.product_image && (
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-[#E5DEC9]">
              <Image src={rev.product_image} alt="" fill sizes="32px" className="object-cover" />
            </span>
          )}
          <span className="text-xs font-medium text-[#171717]/75">
            Review for <strong className="font-bold text-[#111111]">{rev.product_name}</strong>
          </span>
        </Link>
      )}
    </article>
  );
}

function WriteReview({ productId, productName, onDone }: { productId: string; productName: string; onDone: (msg: string) => void }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    getReviewStatus(productId)
      .then((s) => {
        if (!alive) return;
        setStatus(s);
        setName(s.name ?? "");
        if (s.existing) {
          setRating(s.existing.rating);
          setTitle(s.existing.title);
          setBody(s.existing.body);
          setLocation(s.existing.location);
        }
      })
      .catch(() => alive && setStatus({ enabled: true, signedIn: false, canReview: false, reason: "Couldn't load. Please refresh." }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [productId]);

  const box = "mt-6 rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2] p-5 sm:p-6";
  if (loading) return <div className={`${box} text-sm text-[#171717]/70`}>Loading…</div>;
  if (!status?.signedIn && status?.enabled) {
    return (
      <div className={box}>
        <p className="text-base font-semibold text-[#111111]">Sign in to share your experience</p>
        <p className="mt-1 text-sm text-[#171717]/70">Reviews are written by customers with an account so they stay genuine.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="rounded-full bg-[#111111] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#8C671A]">
            Sign in
          </Link>
          <Link href={`/signup?next=${encodeURIComponent(pathname)}`} className="rounded-full border border-[#111111] px-6 py-2.5 text-sm font-bold text-[#111111] hover:bg-white">
            Create account
          </Link>
        </div>
      </div>
    );
  }
  if (!status?.canReview) return <div className={`${box} text-sm font-medium text-[#171717]/80`}>{status?.reason ?? "You can't review this product right now."}</div>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await submitReview({ productId, rating, title, body, location, name });
      if (res.ok) onDone(res.message);
      else setError(res.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const input = "mt-1 w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2.5 text-sm focus:border-[#8C671A] focus:outline-hidden";
  return (
    <form onSubmit={submit} className={box}>
      <h3 className="font-serif text-xl font-bold text-[#111111]">
        {status.existing ? "Update your review of" : "Share your experience with"} {productName}
      </h3>
      {status.existing?.status === "pending" && <p className="mt-1 text-sm text-[#8A4B00]">Your earlier review is waiting for approval.</p>}

      <div className="mt-4">
        <span className="block text-sm font-semibold text-[#171717]">Your rating *</span>
        <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={rating === i}
              aria-label={`${i} star${i > 1 ? "s" : ""}`}
              onClick={() => setRating(i)}
              className="p-0.5"
            >
              <svg viewBox="0 0 20 20" className={`h-8 w-8 ${i <= rating ? "text-[#C59B27]" : "text-[#E5DEC9]"}`} fill="currentColor" aria-hidden="true">
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#171717]">
          Name shown with review *
          <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-semibold text-[#171717]">
          City (optional)
          <input maxLength={60} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mumbai" className={input} />
        </label>
      </div>
      <label className="mt-4 block text-sm font-semibold text-[#171717]">
        Headline (optional)
        <input maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
      </label>
      <label className="mt-4 block text-sm font-semibold text-[#171717]">
        Your review *
        <textarea required minLength={10} maxLength={2000} rows={4} value={body} onChange={(e) => setBody(e.target.value)} className={input} />
      </label>
      {error && <p className="mt-3 text-sm font-semibold text-[#B42318]">{error}</p>}
      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={saving} className="rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#8C671A] disabled:opacity-60">
          {saving ? "Submitting…" : status.existing ? "Update review" : "Submit review"}
        </button>
      </div>
    </form>
  );
}

export default function ReviewsSection({
  productId,
  productName,
  rating,
  reviews,
  storeReviews,
  storeTotal,
  enabled,
}: {
  productId: string;
  productName: string;
  rating: number;
  reviews: PublicReview[];
  storeReviews: PublicReview[];
  storeTotal: number;
  enabled: boolean;
}) {
  const [tab, setTab] = useState<"product" | "store">("product");
  const [sort, setSort] = useState<"recent" | "highest" | "lowest">("recent");
  const [stars, setStars] = useState<number | "all">("all");
  const [writing, setWriting] = useState(false);
  const [thanks, setThanks] = useState<string | null>(null);

  const list = useMemo(() => {
    let l = [...(tab === "product" ? reviews : storeReviews)];
    if (stars !== "all") l = l.filter((r) => r.rating === stars);
    if (sort === "highest") l.sort((a, b) => b.rating - a.rating);
    else if (sort === "lowest") l.sort((a, b) => a.rating - b.rating);
    return l;
  }, [tab, reviews, storeReviews, sort, stars]);

  if (!enabled && reviews.length === 0) return null;

  return (
    <section id="customer-reviews" className="mx-auto max-w-[1760px] scroll-mt-24 px-4 py-8 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold tracking-wide text-[#111111] sm:text-4xl">
          <span className="swashaa-highlight">CUSTOMER REVIEWS</span>
        </h2>
      </div>

      <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs sm:p-8">
        <div className="flex flex-col items-start justify-between gap-5 border-b border-[#E5DEC9] pb-6 md:flex-row md:items-center">
          {reviews.length > 0 ? (
            <div className="flex items-center gap-3">
              <span className="font-serif text-4xl font-bold text-[#111111]">{rating.toFixed(1)}</span>
              <div>
                <Stars rating={rating} size="md" />
                <p className="mt-0.5 text-sm font-medium text-[#171717]/70">
                  Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-base font-medium text-[#171717]/75">No reviews for this product yet — be the first to share yours.</p>
          )}
          {enabled && !thanks && (
            <button
              type="button"
              onClick={() => setWriting((v) => !v)}
              className="rounded-full bg-[#111111] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
            >
              {writing ? "Cancel" : "Write a review"}
            </button>
          )}
        </div>

        {writing && (
          <WriteReview
            productId={productId}
            productName={productName}
            onDone={(msg) => {
              setThanks(msg);
              setWriting(false);
            }}
          />
        )}
        {thanks && <div className="mt-5 rounded-xl bg-[#E6F4EA] px-4 py-3 text-sm font-semibold text-[#137333]">✓ {thanks}</div>}

        {(reviews.length > 0 || storeReviews.length > 0) && (
          <>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(
                  [
                    ["product", `This product (${reviews.length})`],
                    ["store", `All store reviews (${storeTotal})`],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                      tab === key ? "bg-[#111111] text-white" : "bg-[#FAF7F2] text-[#171717]/70 hover:text-[#111111]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Filter by rating"
                  value={String(stars)}
                  onChange={(e) => setStars(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-4 py-2 text-sm font-semibold"
                >
                  <option value="all">All ratings</option>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Sort reviews"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-4 py-2 text-sm font-semibold"
                >
                  <option value="recent">Most recent</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
              </div>
            </div>

            {list.length === 0 ? (
              <p className="mt-6 text-sm text-[#171717]/70">No reviews match this filter.</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">
                {list.map((rev) => (
                  <ReviewCard key={rev.id} rev={rev} showProduct={tab === "store"} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
