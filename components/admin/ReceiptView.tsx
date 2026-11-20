"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, FileText, Gift, PackageCheck, Printer } from "lucide-react";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDate, inr, type OrderStatus, type PaymentStatus } from "@/lib/format";

export interface ReceiptOrderData {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: {
    full_name: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  mrp_total: number;
  subtotal: number;
  gift_wrap_total: number;
  prepaid_discount: number;
  coupon_code: string;
  coupon_discount: number;
  shipping_fee: number;
  payment_fee: number;
  total: number;
  payment_method: "prepaid" | "cod";
  payment_status: PaymentStatus;
  status: OrderStatus;
  courier: string;
  tracking_number: string;
  razorpay_payment_id: string;
  customer_notes: string;
  created_at: string;
  item_count: number;
  items: {
    id: string;
    product_name: string;
    product_sku: string;
    finish: string;
    unit_price: number;
    quantity: number;
    gift_wrap: boolean;
    gift_message: string;
    line_total: number;
  }[];
}

export interface ReceiptStoreData {
  store_name: string;
  support_email: string;
  support_phone: string;
}

const PAYMENT_STAMP_STYLE: Record<PaymentStatus, string> = {
  paid: "border-[#0F5B2B]/30 bg-[#E3F4E8] text-[#0F5B2B]",
  pending: "border-[#8A4B00]/30 bg-[#FDF1DC] text-[#8A4B00]",
  failed: "border-[#912018]/30 bg-[#FDE8E7] text-[#912018]",
  refunded: "border-[#171717]/20 bg-[#F0EEEA] text-[#3D3A35]",
};

export default function ReceiptView({
  order,
  store,
  autoPrint = false,
}: {
  order: ReceiptOrderData;
  store: ReceiptStoreData;
  autoPrint?: boolean;
}) {
  const [mode, setMode] = useState<"invoice" | "packing">("invoice");
  const isPacking = mode === "packing";
  const a = order.shipping_address;

  useEffect(() => {
    if (!autoPrint) return;
    const timer = window.setTimeout(() => window.print(), 250);
    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  return (
    <div className="mx-auto max-w-[820px]">
      {/* Screen-only toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/admin/orders/${order.id}`}
            className="inline-flex items-center gap-1 text-base font-semibold text-[#8C671A] hover:underline"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            Back to order
          </Link>
          <Link href="/admin/orders" className="text-base font-medium text-[#171717]/65 hover:text-[#171717] hover:underline">
            All orders
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode switch */}
          <div className="inline-flex rounded-xl border border-[#D9CFB8] bg-white p-1">
            <button
              type="button"
              onClick={() => setMode("invoice")}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition ${
                !isPacking ? "bg-[#FBF3DF] text-[#6F5114]" : "text-[#171717]/65 hover:text-[#171717]"
              }`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Receipt / Invoice
            </button>
            <button
              type="button"
              onClick={() => setMode("packing")}
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold transition ${
                isPacking ? "bg-[#FBF3DF] text-[#6F5114]" : "text-[#171717]/65 hover:text-[#171717]"
              }`}
            >
              <PackageCheck className="h-4 w-4" aria-hidden="true" />
              Packing Slip
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#8C671A]"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {isPacking ? "Print packing slip" : "Print receipt"}
          </button>
        </div>
      </div>

      {/* Printable A4 document */}
      <article className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-[0_12px_32px_rgba(65,49,20,0.06)] print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        {/* Luxury gold accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#8C671A] via-[#C59B27] to-[#8C671A]" />

        <div className="p-6 sm:p-10 print:px-2 print:py-4">
          {/* Header */}
          <header className="flex flex-col justify-between gap-6 border-b border-[#E9E2D5] pb-6 sm:flex-row sm:items-start print:flex-row print:items-start">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/shiqueen-emblem-2026t.png"
                alt={store.store_name}
                className="h-16 w-16 rounded-xl border border-[#E5DEC9] bg-[#FEFCEC] object-contain p-1.5"
              />
              <div>
                <h1 className="font-serif text-[28px] font-bold leading-none tracking-[0.15em] text-[#171717]">
                  {store.store_name}
                </h1>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-[#8C671A]">
                  Anti-Tarnish Fine Jewellery
                </p>
                <div className="mt-2 space-y-0.5 text-[13px] text-[#171717]/70">
                  {store.support_email && <p>{store.support_email}</p>}
                  {store.support_phone && <p>{store.support_phone}</p>}
                </div>
              </div>
            </div>

            <div className="sm:text-right print:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C671A]">
                {isPacking ? "Packing Slip" : "Order Receipt"}
              </p>
              <p className="mt-1 font-serif text-[26px] font-bold leading-tight text-[#171717]">{order.order_number}</p>
              <p className="mt-1 text-[13px] text-[#171717]/65">{formatDate(order.created_at, true)}</p>
              {!isPacking && (
                <div className="mt-2.5 sm:flex sm:justify-end print:flex print:justify-end">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      PAYMENT_STAMP_STYLE[order.payment_status]
                    }`}
                  >
                    {PAYMENT_STATUS_LABEL[order.payment_status]} · {order.payment_method === "cod" ? "COD" : "Prepaid"}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Customer & Order Info boxes */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2">
            <div className="rounded-xl border border-[#EAE2D3] bg-[#FAF7F1] p-4 sm:p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C671A]">Ship To / Customer</h2>
              <p className="mt-2 text-[15px] font-semibold text-[#171717]">{a.full_name || order.customer_name}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-[#171717]/80">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.state} – {a.pincode}
              </p>
              <div className="mt-2.5 space-y-0.5 border-t border-[#EAE2D3] pt-2.5 text-[13px] text-[#171717]/80">
                <p>
                  <span className="font-semibold text-[#171717]">Phone:</span> {order.phone}
                </p>
                {order.email && (
                  <p className="break-all">
                    <span className="font-semibold text-[#171717]">Email:</span> {order.email}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#EAE2D3] bg-[#FAF7F1] p-4 sm:p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C671A]">Order Details</h2>
              <dl className="mt-2 space-y-2 text-[13.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#171717]/65">Order Status</dt>
                  <dd className="font-semibold text-[#171717]">{ORDER_STATUS_LABEL[order.status]}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#171717]/65">Payment Method</dt>
                  <dd className="font-semibold text-[#171717]">
                    {order.payment_method === "cod" ? "Cash on Delivery" : "Online Prepaid"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#171717]/65">Total Quantity</dt>
                  <dd className="font-semibold text-[#171717]">
                    {order.item_count} item{order.item_count === 1 ? "" : "s"}
                  </dd>
                </div>
                {!isPacking && order.razorpay_payment_id && (
                  <div className="flex flex-col gap-0.5 border-t border-[#EAE2D3] pt-2">
                    <dt className="text-xs text-[#171717]/60">Razorpay Payment ID</dt>
                    <dd className="break-all font-mono text-xs font-medium text-[#171717]">{order.razorpay_payment_id}</dd>
                  </div>
                )}
                {order.courier && (
                  <div className="flex justify-between gap-3 border-t border-[#EAE2D3] pt-2">
                    <dt className="text-[#171717]/65">Courier</dt>
                    <dd className="text-right font-medium text-[#171717]">
                      {order.courier}
                      {order.tracking_number ? ` · ${order.tracking_number}` : ""}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {order.customer_notes && (
            <div className="mt-4 rounded-xl border border-[#E7D7AC] bg-[#FBF5E8] px-4 py-3 text-[13.5px] text-[#5C4512]">
              <span className="font-semibold">Customer note:</span> {order.customer_notes}
            </div>
          )}

          {/* Items table */}
          <section className="mt-6">
            <div className="overflow-hidden rounded-xl border border-[#E5DEC9]">
              <table className="w-full border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#E5DEC9] bg-[#FAF6EE] text-[11px] font-bold uppercase tracking-[0.14em] text-[#5C4512]">
                    <th className="w-10 px-3.5 py-3">#</th>
                    <th className="px-3.5 py-3">Product</th>
                    <th className="px-3.5 py-3">SKU</th>
                    <th className="w-16 px-3.5 py-3 text-right">Qty</th>
                    {!isPacking ? (
                      <>
                        <th className="w-28 px-3.5 py-3 text-right">Unit Price</th>
                        <th className="w-28 px-3.5 py-3 text-right">Amount</th>
                      </>
                    ) : (
                      <th className="w-24 px-3.5 py-3 text-center">Packed</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE8DD]">
                  {order.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="px-3.5 py-3.5 align-top font-medium text-[#171717]/55">{idx + 1}</td>
                      <td className="px-3.5 py-3.5 align-top">
                        <p className="font-semibold text-[#171717]">{item.product_name}</p>
                        {item.finish && <p className="mt-0.5 text-xs text-[#171717]/65">Finish: {item.finish}</p>}
                        {item.gift_wrap && (
                          <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-[#FBF3DF] px-2 py-0.5 text-xs font-medium text-[#6F5114]">
                            <Gift className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            Gift wrapped{item.gift_message ? `: “${item.gift_message}”` : ""}
                          </p>
                        )}
                      </td>
                      <td className="px-3.5 py-3.5 align-top font-mono text-xs font-medium text-[#171717]/80">
                        {item.product_sku?.trim() || "—"}
                      </td>
                      <td className="px-3.5 py-3.5 text-right align-top font-semibold text-[#171717]">{item.quantity}</td>
                      {!isPacking ? (
                        <>
                          <td className="whitespace-nowrap px-3.5 py-3.5 text-right align-top text-[#171717]/80">
                            {inr(item.unit_price)}
                          </td>
                          <td className="whitespace-nowrap px-3.5 py-3.5 text-right align-top font-semibold text-[#171717]">
                            {inr(item.line_total)}
                          </td>
                        </>
                      ) : (
                        <td className="px-3.5 py-3.5 text-center align-top">
                          <span className="inline-block h-4 w-4 rounded border border-[#171717]/40" aria-hidden="true" />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Summary / Care Instructions */}
          {!isPacking ? (
            <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2">
              {/* Jewellery Care & Support */}
              <div className="flex flex-col justify-between rounded-xl border border-[#EFE8DD] bg-[#FDFBF7] p-4 sm:p-5">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C671A]">Jewellery Care</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#171717]/75">
                    To keep your SHIQUEEN pieces shining, wipe gently with a soft dry cloth after use and store them in the
                    provided pouch away from perfumes and harsh chemicals.
                  </p>
                </div>
                <p className="mt-4 text-xs text-[#171717]/60">
                  Questions about your order? Reach us at <span className="font-medium text-[#171717]">{store.support_email}</span>
                  {store.support_phone ? ` or ${store.support_phone}` : ""}.
                </p>
              </div>

              {/* Totals */}
              <div className="rounded-xl border border-[#E5DEC9] bg-[#FAF7F1] p-4 sm:p-5">
                <dl className="space-y-2 text-[13.5px]">
                  {order.mrp_total > order.subtotal && (
                    <div className="flex justify-between text-[#171717]/55">
                      <dt>MRP total</dt>
                      <dd className="line-through">{inr(order.mrp_total)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-[#171717]/75">Subtotal</dt>
                    <dd className="font-medium text-[#171717]">{inr(order.subtotal)}</dd>
                  </div>
                  {order.gift_wrap_total > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-[#171717]/75">Gift wrap</dt>
                      <dd className="font-medium text-[#171717]">{inr(order.gift_wrap_total)}</dd>
                    </div>
                  )}
                  {order.prepaid_discount > 0 && (
                    <div className="flex justify-between text-[#0F5B2B]">
                      <dt>Prepaid discount</dt>
                      <dd className="font-medium">−{inr(order.prepaid_discount)}</dd>
                    </div>
                  )}
                  {order.coupon_discount > 0 && (
                    <div className="flex justify-between text-[#0F5B2B]">
                      <dt>Coupon ({order.coupon_code})</dt>
                      <dd className="font-medium">−{inr(order.coupon_discount)}</dd>
                    </div>
                  )}
                  {order.payment_fee > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-[#171717]/75">
                        {order.payment_method === "cod" ? "COD charges" : "Payment charges"}
                      </dt>
                      <dd className="font-medium text-[#171717]">{inr(order.payment_fee)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-[#171717]/75">Shipping</dt>
                    <dd className="font-medium text-[#171717]">
                      {order.shipping_fee > 0 ? inr(order.shipping_fee) : "Free"}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[#DDD3BE] pt-3 text-lg font-bold text-[#171717]">
                    <dt>Grand Total</dt>
                    <dd>{inr(order.total)}</dd>
                  </div>
                </dl>
              </div>
            </section>
          ) : (
            <section className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-[#EAE2D3] bg-[#FAF7F1] p-5 sm:grid-cols-2 print:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C671A]">Quality Check</p>
                <p className="mt-1.5 text-[13px] text-[#171717]/75">
                  All items verified for finish, quantity, and protective packaging.
                </p>
              </div>
              <div className="flex flex-col justify-end space-y-3 text-[13px] text-[#171717]/75 sm:items-end print:items-end">
                <p>Packed by: _________________________</p>
                <p>Dispatch date: ______________________</p>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="mt-8 border-t border-[#EFE8DD] pt-5 text-center">
            <p className="font-serif text-base font-semibold tracking-wide text-[#171717]">
              Thank you for choosing {store.store_name}
            </p>
            <p className="mt-1 text-xs text-[#171717]/55">
              This is a computer-generated {isPacking ? "packing slip" : "order receipt"} and does not require a physical signature.
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
