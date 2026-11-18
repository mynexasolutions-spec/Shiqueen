"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Check, EyeOff, MessageSquareReply, Star, Trash2 } from "lucide-react";
import { Alert, Textarea } from "@/components/ui/form";
import { Badge } from "@/components/admin/ui";
import { moderateReviewAction } from "@/app/admin/_actions/reviews";
import type { AdminReview } from "@/lib/server/admin/reviews";
import { formatDate } from "@/lib/format";

function OpButton({ op, label, icon, tone = "secondary", confirm }: { op: string; label: string; icon: React.ReactNode; tone?: "secondary" | "danger" | "primary"; confirm?: string }) {
  const cls =
    tone === "danger"
      ? "border-[#F4C7C3] text-[#912018] hover:bg-[#FEF3F2]"
      : tone === "primary"
        ? "border-[#171717] bg-[#171717] text-white hover:bg-[#8C671A]"
        : "border-[#D9CFB8] bg-white hover:border-[#8C671A]";
  return (
    <button
      type="submit"
      name="op"
      value={op}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[15px] font-semibold transition ${cls}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function ReviewCard({ review }: { review: AdminReview }) {
  const [state, action, pending] = useActionState(moderateReviewAction, {});
  const [replying, setReplying] = useState(false);

  return (
    <li className="px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg text-[#C59B27]" aria-label={`${review.rating} out of 5 stars`}>
              {"★".repeat(review.rating)}
              <span className="text-[#E5DEC9]">{"★".repeat(5 - review.rating)}</span>
            </span>
            {review.status === "pending" && <Badge tone="amber">Awaiting approval</Badge>}
            {review.status === "approved" && <Badge tone="green">Live</Badge>}
            {review.status === "hidden" && <Badge tone="neutral">Hidden</Badge>}
            {review.is_featured && <Badge tone="gold">★ On homepage</Badge>}
            {review.verified_purchase && <Badge tone="blue">Verified buyer</Badge>}
          </div>
          <p className="mt-1.5 text-base">
            <strong>{review.author_name}</strong>
            {review.location ? `, ${review.location}` : ""}{" "}
            <span className="text-[#171717]/55">· {formatDate(review.created_at, true)}</span>
          </p>
          <p className="text-[15px] text-[#171717]/65">
            on{" "}
            <Link href={`/products/${review.product_slug}`} target="_blank" className="font-semibold text-[#8C671A] hover:underline">
              {review.product_name}
            </Link>
            {review.user_email && (
              <>
                {" "}· by{" "}
                {review.user_id ? (
                  <Link href={`/admin/customers/${review.user_id}`} className="hover:underline">
                    {review.user_email}
                  </Link>
                ) : (
                  review.user_email
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {review.title && <p className="mt-3 text-[17px] font-semibold">{review.title}</p>}
      <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-[#171717]/85">{review.body}</p>
      {review.admin_reply && !replying && (
        <div className="mt-3 rounded-xl border-l-4 border-[#C59B27] bg-[#FBF7EE] px-4 py-3 text-base">
          <p className="text-[14px] font-bold uppercase tracking-wider text-[#8C671A]">Your reply</p>
          <p className="mt-0.5 whitespace-pre-line">{review.admin_reply}</p>
        </div>
      )}

      <form action={action} className="mt-4 space-y-3">
        <input type="hidden" name="id" value={review.id} />
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {state.message && <Alert tone="success">{state.message}</Alert>}
        {replying && (
          <Textarea name="reply" rows={3} maxLength={1500} defaultValue={review.admin_reply} aria-label="Reply to this review" placeholder="Write a public reply (leave empty to remove)" />
        )}
        <fieldset disabled={pending} className="flex flex-wrap gap-2">
          {replying ? (
            <>
              <OpButton op="reply" label="Save reply" tone="primary" icon={<Check className="h-5 w-5" />} />
              <button type="button" onClick={() => setReplying(false)} className="h-11 rounded-xl px-4 text-[15px] font-semibold hover:bg-[#F3EEE4]">
                Cancel
              </button>
            </>
          ) : (
            <>
              {review.status !== "approved" && <OpButton op="approve" label="Approve" tone="primary" icon={<Check className="h-5 w-5" />} />}
              {review.status !== "hidden" && <OpButton op="hide" label="Hide" icon={<EyeOff className="h-5 w-5" />} />}
              {review.is_featured ? (
                <OpButton op="unfeature" label="Remove from homepage" icon={<Star className="h-5 w-5" />} />
              ) : (
                <OpButton op="feature" label="Feature on homepage" icon={<Star className="h-5 w-5" />} />
              )}
              <button
                type="button"
                onClick={() => setReplying(true)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#D9CFB8] bg-white px-4 text-[15px] font-semibold hover:border-[#8C671A]"
              >
                <MessageSquareReply className="h-5 w-5" /> {review.admin_reply ? "Edit reply" : "Reply"}
              </button>
              <OpButton op="delete" label="Delete" tone="danger" icon={<Trash2 className="h-5 w-5" />} confirm="Delete this review permanently?" />
            </>
          )}
        </fieldset>
      </form>
    </li>
  );
}
