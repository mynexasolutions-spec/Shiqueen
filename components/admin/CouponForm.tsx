"use client";

import { useActionState, useState } from "react";
import { Alert, Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/ui/form";
import { Card } from "@/components/admin/ui";
import { saveCouponAction } from "@/app/admin/_actions/coupons";

export interface CouponFormValues {
  id?: string;
  code: string;
  description: string;
  type: "percent" | "fixed";
  value: number | "";
  min_subtotal: number | "";
  min_items: number | "";
  max_discount: number | "";
  usage_limit: number | "";
  starts_at: string; // yyyy-mm-dd
  ends_at: string;
  is_active: boolean;
  used_count?: number;
  show_as_offer: boolean;
  offer_badge: string;
  offer_title: string;
  offer_text: string;
  offer_subtext: string;
  offer_order: number;
}

export default function CouponForm({ initial }: { initial: CouponFormValues }) {
  const [state, action, pending] = useActionState(saveCouponAction, {});
  const [type, setType] = useState(initial.type);

  return (
    <form action={action} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="space-y-6 xl:col-span-2">
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {state.message && <Alert tone="success">{state.message}</Alert>}
        <Card title="Discount">
          <div className="space-y-5">
            <Field label="Coupon code" htmlFor="code" required hint="Customers type this at checkout. Letters and numbers, no spaces.">
              <Input id="code" name="code" required maxLength={40} defaultValue={initial.code} className="font-mono uppercase tracking-wider" />
            </Field>
            <Field label="Description (internal)" htmlFor="description">
              <Input id="description" name="description" maxLength={200} defaultValue={initial.description} placeholder="e.g. Diwali sale 2026" />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Discount type" htmlFor="type">
                <Select id="type" name="type" value={type} onChange={(e) => setType(e.target.value as "percent" | "fixed")}>
                  <option value="percent">Percentage off (%)</option>
                  <option value="fixed">Fixed amount off (₹)</option>
                </Select>
              </Field>
              <Field label={type === "percent" ? "Percentage (%)" : "Amount (₹)"} htmlFor="value" required>
                <Input id="value" name="value" type="number" min={1} max={type === "percent" ? 100 : undefined} required defaultValue={initial.value} />
              </Field>
            </div>
            {type === "percent" && (
              <Field label="Maximum discount (₹)" htmlFor="max_discount" hint="Optional cap, e.g. 500. Leave empty for no cap.">
                <Input id="max_discount" name="max_discount" type="number" min={0} defaultValue={initial.max_discount} />
              </Field>
            )}
          </div>
        </Card>

        <Card title="Conditions">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Minimum order value (₹)" htmlFor="min_subtotal">
              <Input id="min_subtotal" name="min_subtotal" type="number" min={0} defaultValue={initial.min_subtotal} placeholder="0" />
            </Field>
            <Field label="Minimum number of items" htmlFor="min_items">
              <Input id="min_items" name="min_items" type="number" min={0} defaultValue={initial.min_items} placeholder="0" />
            </Field>
            <Field label="Starts on" htmlFor="starts_at" hint="Optional.">
              <Input id="starts_at" name="starts_at" type="date" defaultValue={initial.starts_at} />
            </Field>
            <Field label="Ends on" htmlFor="ends_at" hint="Optional. Valid until the end of this day.">
              <Input id="ends_at" name="ends_at" type="date" defaultValue={initial.ends_at} />
            </Field>
            <Field label="Total usage limit" htmlFor="usage_limit" hint={`Optional. Used ${initial.used_count ?? 0} time${initial.used_count === 1 ? "" : "s"} so far.`}>
              <Input id="usage_limit" name="usage_limit" type="number" min={0} defaultValue={initial.usage_limit} placeholder="Unlimited" />
            </Field>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card title="Offer card on product pages" description="Show this code as a copyable offer card on every product page.">
          <div className="space-y-4">
            <Checkbox name="show_as_offer" defaultChecked={initial.show_as_offer} label="Show as offer on product pages" />
            <Field label="Badge" htmlFor="offer_badge" hint="e.g. “Save ₹800”">
              <Input id="offer_badge" name="offer_badge" maxLength={40} defaultValue={initial.offer_badge} />
            </Field>
            <Field label="Offer title" htmlFor="offer_title">
              <Input id="offer_title" name="offer_title" maxLength={100} defaultValue={initial.offer_title} />
            </Field>
            <Field label="Offer text" htmlFor="offer_text">
              <Textarea id="offer_text" name="offer_text" rows={2} maxLength={200} defaultValue={initial.offer_text} />
            </Field>
            <Field label="Small print" htmlFor="offer_subtext">
              <Input id="offer_subtext" name="offer_subtext" maxLength={200} defaultValue={initial.offer_subtext} />
            </Field>
            <Field label="Display order" htmlFor="offer_order" hint="Lower numbers show first.">
              <Input id="offer_order" name="offer_order" type="number" defaultValue={initial.offer_order} />
            </Field>
          </div>
        </Card>
        <Card title="Status">
          <Checkbox name="is_active" defaultChecked={initial.is_active} label="Active" hint="Inactive codes are rejected at checkout." />
        </Card>
        <SubmitButton size="lg" className="w-full" pending={pending} pendingText="Saving…">
          {initial.id ? "Save coupon" : "Create coupon"}
        </SubmitButton>
      </div>
    </form>
  );
}
