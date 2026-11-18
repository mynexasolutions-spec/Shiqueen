import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { inr } from "@/lib/format";

interface Item {
  id: string;
  product_name: string;
  product_slug: string;
  image_url: string;
  finish: string;
  unit_price: number;
  quantity: number;
  gift_wrap: boolean;
  gift_message: string;
  line_total: number;
}

interface Totals {
  mrp_total: number;
  subtotal: number;
  gift_wrap_total: number;
  prepaid_discount: number;
  coupon_code: string;
  coupon_discount: number;
  shipping_fee: number;
  payment_fee?: number;
  payment_method?: string;
  total: number;
}

/** Line items + price breakdown, used by both the admin and customer order pages. */
export default function OrderBreakdown({ items, totals, linkProducts = true }: { items: Item[]; totals: Totals; linkProducts?: boolean }) {
  return (
    <div>
      <ul className="divide-y divide-[#EFE8DD]">
        {items.map((i) => (
          <li key={i.id} className="flex gap-4 py-4 first:pt-0">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF7F2]">
              {i.image_url && <Image src={i.image_url} alt="" fill sizes="80px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              {linkProducts && i.product_slug ? (
                <Link href={`/products/${i.product_slug}`} target="_blank" className="text-[17px] font-semibold text-[#171717] hover:text-[#8C671A]">
                  {i.product_name}
                </Link>
              ) : (
                <p className="text-[17px] font-semibold text-[#171717]">{i.product_name}</p>
              )}
              <p className="mt-0.5 text-base text-[#171717]/65">
                {i.finish && `${i.finish} · `}
                {inr(i.unit_price)} × {i.quantity}
              </p>
              {i.gift_wrap && (
                <p className="mt-1.5 flex items-start gap-1.5 text-[15px] text-[#8C671A]">
                  <Gift className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    Gift wrapped{i.gift_message ? <>: “{i.gift_message}”</> : null}
                  </span>
                </p>
              )}
            </div>
            <p className="shrink-0 text-[17px] font-semibold">{inr(i.line_total)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-[#EFE8DD] pt-4 text-base">
        {totals.mrp_total > totals.subtotal && (
          <div className="flex justify-between text-[#171717]/60">
            <dt>MRP total</dt>
            <dd className="line-through">{inr(totals.mrp_total)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-[#171717]/70">Subtotal</dt>
          <dd className="font-medium">{inr(totals.subtotal)}</dd>
        </div>
        {totals.gift_wrap_total > 0 && (
          <div className="flex justify-between">
            <dt className="text-[#171717]/70">Gift wrap</dt>
            <dd className="font-medium">{inr(totals.gift_wrap_total)}</dd>
          </div>
        )}
        {totals.prepaid_discount > 0 && (
          <div className="flex justify-between text-[#0F5B2B]">
            <dt>Prepaid discount</dt>
            <dd className="font-medium">−{inr(totals.prepaid_discount)}</dd>
          </div>
        )}
        {totals.coupon_discount > 0 && (
          <div className="flex justify-between text-[#0F5B2B]">
            <dt>Coupon {totals.coupon_code}</dt>
            <dd className="font-medium">−{inr(totals.coupon_discount)}</dd>
          </div>
        )}
        {(totals.payment_fee ?? 0) > 0 && (
          <div className="flex justify-between">
            <dt className="text-[#171717]/70">{totals.payment_method === "cod" ? "COD charges" : "Payment charges"}</dt>
            <dd className="font-medium">{inr(totals.payment_fee ?? 0)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-[#171717]/70">Shipping</dt>
          <dd className="font-medium">{totals.shipping_fee > 0 ? inr(totals.shipping_fee) : "Free"}</dd>
        </div>
        <div className="flex justify-between border-t border-[#EFE8DD] pt-3 text-xl font-bold">
          <dt>Total</dt>
          <dd>{inr(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
