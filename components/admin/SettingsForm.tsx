"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Banknote, Bell, CreditCard, Lock, MessageSquareText, Truck } from "lucide-react";
import { Alert, Field, Input, SubmitButton, Textarea } from "@/components/ui/form";
import { saveSettingsAction } from "@/app/admin/_actions/settings";
import type { StoreSettings } from "@/lib/settings-defaults";

export type SettingsTab = "payments" | "shipping" | "reviews" | "store" | "security";

const TABS: { key: SettingsTab; label: string; description: string; icon: typeof CreditCard }[] = [
  { key: "payments", label: "Payments", description: "Online payment & cash on delivery", icon: CreditCard },
  { key: "shipping", label: "Shipping & gift wrap", description: "Delivery charges and gifting", icon: Truck },
  { key: "reviews", label: "Reviews", description: "Who can review and approval", icon: MessageSquareText },
  { key: "store", label: "Store & alerts", description: "Contact details and notifications", icon: Bell },
  { key: "security", label: "Security", description: "Your admin password", icon: Lock },
];

const inr = (n: number) => `₹${(Number.isFinite(n) ? n : 0).toLocaleString("en-IN")}`;

/** Accessible on/off switch that still submits like a checkbox. */
function Switch({ name, checked, onChange, label }: { name: string; checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-3">
      <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" aria-label={label} />
      <span className="h-8 w-14 rounded-full bg-[#D9CFB8] transition peer-checked:bg-[#137333] peer-focus-visible:ring-4 peer-focus-visible:ring-[#C59B27]/30" />
      <span className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-6" />
      <span className={`text-base font-semibold ${checked ? "text-[#137333]" : "text-[#171717]/55"}`}>{checked ? "On" : "Off"}</span>
    </label>
  );
}

function ToggleRow({ name, defaultChecked, title, hint }: { name: string; defaultChecked: boolean; title: string; hint?: string }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-[17px] font-semibold text-[#171717]">{title}</p>
        {hint && <p className="mt-0.5 text-[15px] text-[#171717]/65">{hint}</p>}
      </div>
      <Switch name={name} checked={on} onChange={setOn} label={title} />
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E5DEC9] bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
      <header className="border-b border-[#EFE8DD] px-5 py-4 sm:px-7 sm:py-5">
        <h2 className="text-xl font-semibold text-[#171717] sm:text-[22px]">{title}</h2>
        {description && <p className="mt-1 text-[15px] text-[#171717]/65 sm:text-base">{description}</p>}
      </header>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}

interface MethodState {
  enabled: boolean;
  label: string;
  description: string;
  fee: number;
}

function MethodCard({
  prefix,
  icon,
  title,
  state,
  setState,
  children,
}: {
  prefix: "online" | "cod";
  icon: ReactNode;
  title: string;
  state: MethodState;
  setState: (s: MethodState) => void;
  children?: ReactNode;
}) {
  return (
    <div className={`rounded-2xl border-2 transition ${state.enabled ? "border-[#C59B27]/60 bg-white" : "border-[#E5DEC9] bg-[#FAF7F2]"}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[#EFE8DD] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${state.enabled ? "bg-[#FBF3DF] text-[#8C671A]" : "bg-[#EFE8DD] text-[#171717]/45"}`}>{icon}</span>
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <Switch name={`${prefix}_enabled`} checked={state.enabled} onChange={(enabled) => setState({ ...state, enabled })} label={`Offer ${title}`} />
      </div>
      <div className={`space-y-5 p-5 transition ${state.enabled ? "" : "opacity-55"}`}>
        <Field label="Name at checkout" htmlFor={`${prefix}_label`}>
          <Input id={`${prefix}_label`} name={`${prefix}_label`} maxLength={80} value={state.label} onChange={(e) => setState({ ...state, label: e.target.value })} />
        </Field>
        <Field label="Short description" htmlFor={`${prefix}_description`}>
          <Input
            id={`${prefix}_description`}
            name={`${prefix}_description`}
            maxLength={200}
            value={state.description}
            onChange={(e) => setState({ ...state, description: e.target.value })}
          />
        </Field>
        {children}
      </div>
    </div>
  );
}

function CheckoutPreview({ online, cod, discount, codMax }: { online: MethodState; cod: MethodState; discount: number; codMax: number }) {
  const sample = 1999;
  const options = [
    online.enabled && {
      key: "online",
      title: `${online.label || "Online payment"}${discount > 0 ? ` (Extra ${discount}% OFF)` : ""}`,
      text: online.description,
      extra: [discount > 0 && `Save ${inr(Math.round((sample * discount) / 100))}`, online.fee > 0 && `+ ${inr(online.fee)} payment charge`].filter(Boolean),
      total: sample - Math.round((sample * discount) / 100) + (online.fee || 0),
    },
    cod.enabled && {
      key: "cod",
      title: cod.label || "Cash on Delivery",
      text: cod.description,
      extra: [cod.fee > 0 && `+ ${inr(cod.fee)} COD charge`, codMax > 0 && `Only for orders up to ${inr(codMax)}`].filter(Boolean),
      total: sample + (cod.fee || 0),
    },
  ].filter(Boolean) as { key: string; title: string; text: string; extra: string[]; total: number }[];

  return (
    <div className="rounded-2xl border border-dashed border-[#D9CFB8] bg-[#FDFBF7] p-5">
      <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#8C671A]">Customer preview</p>
      <p className="mt-0.5 text-[15px] text-[#171717]/65">How the options look at checkout for a {inr(sample)} order.</p>
      {options.length === 0 ? (
        <p className="mt-4 rounded-xl bg-[#FEF3F2] p-4 text-base font-medium text-[#912018]">No payment method is on — customers can&apos;t check out.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {options.map((o, i) => (
            <div key={o.key} className={`flex items-start gap-3 rounded-xl border bg-white p-4 ${i === 0 ? "border-[#171717]" : "border-[#E5DEC9]"}`}>
              <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${i === 0 ? "border-[#171717] bg-[#171717] shadow-[inset_0_0_0_3px_white]" : "border-[#B5AC98]"}`} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold">{o.title}</p>
                {o.text && <p className="text-[15px] text-[#171717]/65">{o.text}</p>}
                {o.extra.map((x) => (
                  <p key={x} className="text-[15px] font-medium text-[#8A4B00]">
                    {x}
                  </p>
                ))}
              </div>
              <p className="shrink-0 text-base font-semibold">{inr(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SettingsForm({
  initial,
  initialTab,
  security,
}: {
  initial: StoreSettings;
  initialTab: SettingsTab;
  security: ReactNode;
}) {
  const [state, action, pending] = useActionState(saveSettingsAction, {});
  const [tab, setTab] = useState<SettingsTab>(initialTab);
  // Dirty = edited since the last save result arrived (no effects needed).
  const [editedAt, setEditedAt] = useState<object | null>(null);
  const dirty = editedAt === state;

  const [online, setOnline] = useState<MethodState>({
    enabled: initial.online_enabled,
    label: initial.online_label,
    description: initial.online_description,
    fee: initial.online_fee,
  });
  const [cod, setCod] = useState<MethodState>({
    enabled: initial.cod_enabled,
    label: initial.cod_label,
    description: initial.cod_description,
    fee: initial.cod_fee,
  });
  const [discount, setDiscount] = useState(initial.prepaid_discount_percent);
  const [codMax, setCodMax] = useState(initial.cod_max_order);

  const selectTab = (t: SettingsTab) => {
    setTab(t);
    window.history.replaceState(null, "", `?tab=${t}`);
  };

  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
      {/* Section menu */}
      <nav aria-label="Settings sections" className="lg:sticky lg:top-8 lg:self-start">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {TABS.map(({ key, label, description, icon: Icon }) => {
            const active = tab === key;
            return (
              <li key={key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => selectTab(key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    active ? "bg-[#171717] text-white" : "bg-white text-[#171717] hover:bg-[#F3EEE4] lg:bg-transparent"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#E9C46A]" : "text-[#8C671A]"}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-[17px] font-semibold">{label}</span>
                    <span className={`hidden text-[14px] lg:block ${active ? "text-white/70" : "text-[#171717]/55"}`}>{description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0">
        {/* Store settings: one form; inactive sections are hidden (not removed) so every field still saves. */}
        <form action={action} onChange={() => setEditedAt(state)} className={tab === "security" ? "hidden" : "space-y-6 pb-28"}>
          {state.error && <Alert tone="error">{state.error}</Alert>}

          <div className={tab === "payments" ? "space-y-6" : "hidden"}>
            <Panel title="Payment methods" description="Turn methods on or off, and add a charge or discount for each one. Changes apply to checkout immediately.">
              <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
                <MethodCard prefix="online" icon={<CreditCard className="h-6 w-6" />} title="Online payment" state={online} setState={setOnline}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Discount (%)" htmlFor="prepaid_discount_percent" hint="0 = no discount.">
                      <Input
                        id="prepaid_discount_percent"
                        name="prepaid_discount_percent"
                        type="number"
                        min={0}
                        max={90}
                        value={discount}
                        onChange={(e) => setDiscount(num(e.target.value))}
                      />
                    </Field>
                    <Field label="Extra charge (₹)" htmlFor="online_fee" hint="0 = no charge.">
                      <Input id="online_fee" name="online_fee" type="number" min={0} value={online.fee} onChange={(e) => setOnline({ ...online, fee: num(e.target.value) })} />
                    </Field>
                  </div>
                  <Field label="Payment instructions" htmlFor="online_instructions" hint="Shown after ordering and in the confirmation email — e.g. your UPI ID.">
                    <Textarea id="online_instructions" name="online_instructions" rows={3} maxLength={1000} defaultValue={initial.online_instructions} />
                  </Field>
                  <p className="rounded-xl bg-[#FBF7EE] px-4 py-3 text-[15px] text-[#5C4512]">
                    Online orders arrive as <strong>Unpaid</strong>. Mark them paid from the order page once you receive the money.
                  </p>
                </MethodCard>

                <MethodCard prefix="cod" icon={<Banknote className="h-6 w-6" />} title="Cash on Delivery" state={cod} setState={setCod}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="COD charge (₹)" htmlFor="cod_fee" hint="Added only to COD orders.">
                      <Input id="cod_fee" name="cod_fee" type="number" min={0} value={cod.fee} onChange={(e) => setCod({ ...cod, fee: num(e.target.value) })} />
                    </Field>
                    <Field label="Allow COD up to (₹)" htmlFor="cod_max_order" hint="0 = no limit.">
                      <Input id="cod_max_order" name="cod_max_order" type="number" min={0} value={codMax} onChange={(e) => setCodMax(num(e.target.value))} />
                    </Field>
                  </div>
                </MethodCard>
              </div>
            </Panel>
            <CheckoutPreview online={online} cod={cod} discount={discount} codMax={codMax} />
          </div>

          <div className={tab === "shipping" ? "" : "hidden"}>
            <Panel title="Shipping & gift wrap" description="Shown in the bag and at checkout.">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Field label="Shipping fee (₹)" htmlFor="shipping_fee" hint="0 = shipping is always free.">
                  <Input id="shipping_fee" name="shipping_fee" type="number" min={0} defaultValue={initial.shipping_fee} />
                </Field>
                <Field label="Free shipping above (₹)" htmlFor="free_shipping_threshold" hint="0 = no free-shipping threshold.">
                  <Input id="free_shipping_threshold" name="free_shipping_threshold" type="number" min={0} defaultValue={initial.free_shipping_threshold} />
                </Field>
                <Field label="Gift wrap (₹ per item)" htmlFor="gift_wrap_price">
                  <Input id="gift_wrap_price" name="gift_wrap_price" type="number" min={0} defaultValue={initial.gift_wrap_price} />
                </Field>
              </div>
            </Panel>
          </div>

          <div className={tab === "reviews" ? "" : "hidden"}>
            <Panel title="Product reviews" description="Customers must be signed in to write a review.">
              <div className="divide-y divide-[#EFE8DD]">
                <ToggleRow name="reviews_enabled" defaultChecked={initial.reviews_enabled} title="Allow customers to write reviews" />
                <ToggleRow
                  name="reviews_require_approval"
                  defaultChecked={initial.reviews_require_approval}
                  title="Approve reviews before they appear"
                  hint="New reviews wait in Admin → Reviews until you approve them."
                />
                <ToggleRow name="reviews_buyers_only" defaultChecked={initial.reviews_buyers_only} title="Only buyers can review" hint="Customers must have ordered the product first." />
              </div>
            </Panel>
          </div>

          <div className={tab === "store" ? "" : "hidden"}>
            <Panel title="Store & alerts" description="WhatsApp, social links and the logo are in Storefront → Brand & contact.">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Store name" htmlFor="store_name">
                  <Input id="store_name" name="store_name" maxLength={80} defaultValue={initial.store_name} />
                </Field>
                <Field label="New-order alert email" htmlFor="order_notification_email" hint="Receives an email for every new order.">
                  <Input id="order_notification_email" name="order_notification_email" type="email" defaultValue={initial.order_notification_email} />
                </Field>
                <Field label="Support email" htmlFor="support_email">
                  <Input id="support_email" name="support_email" type="email" defaultValue={initial.support_email} />
                </Field>
                <Field label="Support phone" htmlFor="support_phone">
                  <Input id="support_phone" name="support_phone" type="tel" defaultValue={initial.support_phone} />
                </Field>
                <Field label="Low-stock warning at" htmlFor="low_stock_threshold" hint="Products at or below this quantity are flagged on the dashboard.">
                  <Input id="low_stock_threshold" name="low_stock_threshold" type="number" min={0} defaultValue={initial.low_stock_threshold} />
                </Field>
              </div>
            </Panel>
          </div>

          {/* Sticky save bar */}
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E5DEC9] bg-white/95 px-4 py-3 backdrop-blur lg:left-72">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 lg:px-6">
              <div className="min-w-0 flex-1">
                {state.error && !dirty ? (
                  <p className="text-base font-medium text-[#B42318]">{state.error}</p>
                ) : state.message && !dirty ? (
                  <Alert tone="success">{state.message}</Alert>
                ) : (
                  <p className="text-base text-[#171717]/70">{dirty ? "You have unsaved changes." : "Settings are up to date."}</p>
                )}
              </div>
              <SubmitButton size="lg" pending={pending} pendingText="Saving…" disabled={!dirty}>
                Save settings
              </SubmitButton>
            </div>
          </div>
        </form>

        <div className={tab === "security" ? "" : "hidden"}>{security}</div>
      </div>
    </div>
  );
}
