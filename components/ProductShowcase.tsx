"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  FEATURED_PRODUCTS,
  SOCIAL_LINKS,
  type ProductItem,
} from "@/lib/brand-data";
import { WhatsAppIcon } from "@/components/Header";

const TABS = [
  { id: "all", label: "All Creations" },
  { id: "jewelry", label: "Anti-Tarnish Jewelry" },
  { id: "watches", label: "Anti-Tarnish Watches" },
  { id: "festive", label: "Festive & Ethnic Sets" },
  { id: "gifting", label: "Hampers & Bouquets" },
] as const;

interface ProductShowcaseProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ProductShowcase({
  activeTab = "all",
  onTabChange,
}: ProductShowcaseProps) {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const filteredProducts =
    currentTab === "all"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.category === currentTab);

  const handleAddToCart = (product: ProductItem) => {
    setAddedId(product.id);
    setToastMessage(`"${product.name}" added to cart`);
    setTimeout(() => setAddedId(null), 1800);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = (product: ProductItem) => {
    const text = `Hi Shiqueen! I want to BUY NOW: "${product.name}" (₹${product.price.toLocaleString("en-IN")}). Please share checkout details.`;
    window.open(SOCIAL_LINKS.whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const card = sliderRef.current.firstElementChild as HTMLElement;
      const stride = card ? card.offsetWidth + 12 : 160;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -stride : stride,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="bestsellers"
      aria-label="Trending Creations"
      className="border-b border-[#E5DEC9] bg-[#F7F3EB] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header & Section Title */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">
                Curated For Every Queen
              </p>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
              Trending <span className="italic text-[#8C671A]">Bestsellers</span>
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#171717]/70 sm:text-sm">
              Hand-picked waterproof daily luxury &amp; tailor-made celebration gifting creations.
            </p>
          </div>

          {/* WhatsApp Direct Help Concierge */}
          <a
            href={SOCIAL_LINKS.whatsappUrl(
              "Hi Shiqueen! I need assistance choosing jewelry/gift hampers from your catalog."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#8C671A]/40 bg-white px-4 py-2 text-xs font-semibold text-[#171717] shadow-xs transition hover:border-[#8C671A] hover:bg-[#8C671A] hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#8C671A] group-hover:text-white" />
            <span>Need Custom Advice? Chat on WhatsApp</span>
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:gap-2.5">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all sm:px-5 sm:py-2.5 sm:text-[13px] ${
                  isActive
                    ? "bg-[#171717] text-[#FAF6EE] shadow-md"
                    : "border border-[#E5DEC9] bg-white text-[#171717]/75 hover:border-[#8C671A] hover:text-[#171717]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Swipe Navigation Hint & Arrows */}
        <div className="mt-5 flex items-center justify-between sm:hidden">
          <span className="text-[11px] font-medium text-[#171717]/60">
            Swipe to explore ({filteredProducts.length} items)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Previous product"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-xs font-bold text-[#171717] shadow-xs active:scale-90"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Next product"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-xs font-bold text-[#171717] shadow-xs active:scale-90"
            >
              →
            </button>
          </div>
        </div>

        {/* Products 2-Card Slider on Mobile, Grid on Desktop */}
        <div
          ref={sliderRef}
          className="mt-3 flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-2 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7 sm:overflow-visible sm:pb-0"
        >
          {filteredProducts.map((product) => {
            const discountPercent = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) *
                100
            );

            return (
              <div
                key={product.id}
                className="group relative flex shrink-0 w-[calc(50%-6px)] snap-start flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B27] hover:shadow-xl sm:w-auto sm:shrink"
              >
                {/* 1. Edge-to-Edge Flush 1:1 Image */}
                <div
                  className="relative aspect-square w-full cursor-pointer overflow-hidden bg-[#FAF7F2]"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-106"
                  />

                  {/* Top Left Badge (Hidden on mobile) */}
                  <span className="hidden sm:inline-block absolute left-2.5 top-2.5 rounded-full border border-white/40 bg-[#171717]/85 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs sm:text-[10px]">
                    {product.badge}
                  </span>

                  {/* Top Right Discount Pill (Hidden on mobile) */}
                  <span className="hidden sm:inline-block absolute right-2.5 top-2.5 rounded-full bg-[#8C671A] px-2 py-0.5 text-[9px] font-bold text-white shadow-xs sm:text-[10px]">
                    {discountPercent}% OFF
                  </span>

                  {/* Quick View Overlay Button */}
                  <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="w-full rounded-full bg-white/95 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-[#171717] shadow-md backdrop-blur-xs transition hover:bg-[#171717] hover:text-white"
                    >
                      Quick Details
                    </button>
                  </div>
                </div>

                {/* 2. Compact Structured Luxury Bottom Info Area (Clean Sans-Serif Poppins) */}
                <div className="flex flex-col justify-between bg-white px-2.5 pt-2.5 pb-3 sm:px-3.5 sm:pt-3 sm:pb-3.5">
                  <div>
                    {/* Title: Clean Sans-Serif Poppins, 2 lines max with crystal-clear widescreen contrast */}
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="line-clamp-2 h-[2.6em] cursor-pointer font-sans text-[12px] font-medium leading-snug text-[#111111] transition-colors hover:text-[#8C671A] sm:text-[13.5px] lg:text-[14.5px]"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Price Row: Bold Sans-Serif Numbers, 100% Readable on Widescreen */}
                    <div className="mt-1 flex items-baseline gap-1.5 sm:mt-1.5 sm:gap-2">
                      <span className="font-sans text-[13px] font-bold text-[#111111] sm:text-base lg:text-[17px]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="font-sans text-[10.5px] font-normal text-[#666666] line-through sm:text-xs lg:text-[13px]">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Buttons: Full-width stacked rows on mobile (Solution B), side-by-side on desktop */}
                  <div className="mt-2.5 flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[#111111] py-1.5 text-center font-sans text-[10.5px] font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:bg-[#8C671A] active:scale-98 sm:py-2 sm:text-[11px]"
                    >
                      Buy Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`inline-flex w-full items-center justify-center rounded-full border py-1.5 text-center font-sans text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-98 sm:py-2 sm:text-[11px] ${
                        addedId === product.id
                          ? "border-[#107C41] bg-[#107C41] text-white"
                          : "border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                      }`}
                    >
                      {addedId === product.id ? "✓ Added" : "+ Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-[#C59B27]/40 bg-[#171717] px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#107C41] text-[10px] font-bold text-white">
            ✓
          </span>
          <p className="text-xs font-medium text-[#FAF6EE]">{toastMessage}</p>
        </div>
      )}

      {/* Quick Details Modal */}
      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close modal"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF7F2] text-lg font-bold text-[#171717] transition hover:bg-[#171717] hover:text-white"
            >
              ×
            </button>

            <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
              {/* Product Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#171717] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {selectedProduct.badge}
                </span>
              </div>

              {/* Product Info */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C671A]">
                  {selectedProduct.categoryLabel}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#171717]">
                  {selectedProduct.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="font-sans text-2xl font-bold text-[#111111]">
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </span>
                  <span className="font-sans text-sm text-[#666666] line-through">
                    ₹{selectedProduct.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-full bg-[#8C671A]/10 px-2 py-0.5 text-xs font-bold text-[#8C671A]">
                    Save ₹
                    {(
                      selectedProduct.originalPrice - selectedProduct.price
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#171717]/75 sm:text-sm">
                  {selectedProduct.description}
                </p>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {selectedProduct.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-medium text-[#171717]"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: Add to Cart & Buy Now (One Line) */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(selectedProduct)}
                    className={`flex w-full items-center justify-center rounded-full border py-3 text-center text-xs font-semibold uppercase tracking-wider transition ${
                      addedId === selectedProduct.id
                        ? "border-[#107C41] bg-[#107C41] text-white"
                        : "border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                    }`}
                  >
                    {addedId === selectedProduct.id ? "✓ Added" : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="flex w-full items-center justify-center rounded-full bg-[#111111] py-3 text-center text-xs font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-[#8C671A]"
                  >
                    Buy Now
                  </button>
                </div>
                <p className="mt-3 text-center text-[10px] text-[#171717]/60">
                  Pan-India Free Shipping on prepaid orders • 1-on-1 WhatsApp Support
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
