"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSite, useWhatsApp } from "@/components/site/SiteProvider";
import { WhatsAppIcon } from "@/components/Header";

function BagEmptySvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-[#8C671A]"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function GiftSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function SparkleSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 3v4M21 5h-4" />
    </svg>
  );
}

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    totalItems,
    subtotal,
    totalOriginalPrice,
    giftWrapTotal,
    grandTotal,
    giftWrapPrice: GIFT_WRAP_PRICE,
  } = useCart();
  const site = useSite();
  const whatsapp = useWhatsApp();
  const { shipping_fee, free_shipping_threshold } = site.settings;
  const shippingFree = shipping_fee === 0 || (free_shipping_threshold > 0 && subtotal >= free_shipping_threshold);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const totalSavings = Math.max(0, totalOriginalPrice - subtotal);

  const handleWhatsAppCartCheckout = () => {
    const itemLines = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} (${item.plating}) × ${item.quantity} — ₹${(
            item.price * item.quantity
          ).toLocaleString("en-IN")}${item.giftWrap ? " [Special Gift Wrap]" : ""}`
      )
      .join("\n");
    const text = `Hi Shiqueen! I would like to place an order:\n\n${itemLines}\n\nTotal Payable: ₹${grandTotal.toLocaleString(
      "en-IN"
    )}\nPlease share payment & shipping details.`;
    window.open(whatsapp(text), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col bg-[#FAF7F2] text-[#171717] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E5DEC9] bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-xs font-bold text-[#FAF6EE]">
              {totalItems}
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-wide text-[#171717]">
                Your Royal Bag
              </h2>
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#8C671A]">
                100% Anti-Tarnish • Free Pan-India Shipping
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close shopping bag"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DEC9] bg-[#FAF7F2] text-lg font-semibold text-[#171717] transition hover:bg-[#171717] hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Free Shipping / Offer Banner */}
        <div className="border-b border-[#E5DEC9] bg-[#EFE8E4] px-5 py-2.5">
          <div className="flex items-center justify-between text-xs font-medium text-[#171717]">
            <span className="inline-flex items-center gap-1.5">
              <SparkleSvg className="h-3.5 w-3.5 text-[#8C671A]" />
              <span>{site.content.cart.drawer_promo}</span>
            </span>
            <span className="rounded-full bg-[#107C41] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Unlocked
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E5DEC9] bg-white shadow-xs">
              <BagEmptySvg />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-[#171717]">
              Your bag is empty
            </h3>
            <p className="mt-1.5 max-w-xs text-xs font-medium leading-relaxed text-[#171717]/70 xl:text-[13px] xl:font-semibold xl:text-[#171717]/82">
              Explore our waterproof 18K gold-plated necklaces, earrings, watches &amp; bespoke gift hampers.
            </p>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-6 rounded-full bg-[#171717] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-[#E5DEC9] overflow-y-auto px-5 py-3">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.plating}-${item.giftWrap ? "gift" : "std"}`}
                  className="flex gap-3.5 py-4"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-white"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-sans text-xs font-semibold text-[#171717] transition hover:text-[#8C671A] sm:text-sm"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] font-medium text-[#171717]/70 xl:text-xs xl:font-semibold xl:text-[#171717]/82">
                          Finish:{" "}
                          <span className="font-semibold text-[#171717] xl:font-bold">
                            {item.plating}
                          </span>
                        </p>
                        {item.giftWrap && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#EFE8E4] px-2 py-0.5 text-[10px] font-semibold text-[#8C671A]">
                            <GiftSvg className="h-3 w-3 text-[#8C671A]" />
                            <span>Special Gift Wrap (+₹{GIFT_WRAP_PRICE})</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id, item.plating, item.giftWrap)
                        }
                        aria-label={`Remove ${item.name}`}
                        className="text-xs text-[#171717]/45 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center rounded-full border border-[#E5DEC9] bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.plating,
                              item.quantity - 1,
                              item.giftWrap
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-xs font-bold text-[#171717] transition hover:text-[#8C671A]"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-xs font-semibold text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.plating,
                              item.quantity + 1,
                              item.giftWrap
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center text-xs font-bold text-[#171717] transition hover:text-[#8C671A]"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-sans text-sm font-bold text-[#111111]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <span className="ml-1.5 text-[11px] font-medium text-[#171717]/65 line-through xl:font-semibold xl:text-[#171717]/75">
                          ₹
                          {(item.originalPrice * item.quantity).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer: Summary + Checkout CTAs */}
            <div className="border-t border-[#E5DEC9] bg-white p-5 shadow-[0_-6px_24px_rgba(0,0,0,0.05)]">
              <div className="space-y-1.5 text-xs font-medium xl:font-semibold">
                <div className="flex justify-between text-[#171717]/75 xl:text-[#171717]/85">
                  <span>Bag Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-[#171717]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {giftWrapTotal > 0 && (
                  <div className="flex items-center justify-between text-[#171717]/75 xl:text-[#171717]/85">
                    <span className="inline-flex items-center gap-1.5">
                      <GiftSvg className="h-3.5 w-3.5 text-[#8C671A]" />
                      <span>Special Gift Wrap</span>
                    </span>
                    <span className="font-bold text-[#171717]">
                      ₹{giftWrapTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#107C41]">
                  <span>Total Savings</span>
                  <span className="font-bold">
                    −₹{totalSavings.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#171717]/75 xl:text-[#171717]/85">
                  <span>Pan-India Express Shipping</span>
                  {shippingFree ? (
                    <span className="font-bold text-[#107C41]">FREE</span>
                  ) : (
                    <span className="font-bold text-[#171717]">₹{shipping_fee.toLocaleString("en-IN")}</span>
                  )}
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E5DEC9] pt-2.5 text-sm font-bold text-[#111111]">
                  <span>Estimated Total</span>
                  <span className="text-base">
                    ₹{(grandTotal + (shippingFree ? 0 : shipping_fee)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex w-full items-center justify-center rounded-full bg-[#111111] py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-white shadow-md transition hover:bg-[#8C671A]"
                >
                  Proceed to Checkout • ₹{grandTotal.toLocaleString("en-IN")}
                </Link>

                <button
                  type="button"
                  onClick={handleWhatsAppCartCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#171717] bg-[#FAF7F2] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717] transition hover:border-[#8C671A] hover:text-[#8C671A]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#1E7E34]" />
                  <span>{site.content.cart.whatsapp_cta}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
