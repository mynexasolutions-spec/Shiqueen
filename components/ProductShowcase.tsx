"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useSite, useWhatsApp } from "@/components/site/SiteProvider";
import { splitHighlight } from "@/lib/site-types";
import type { CatalogProduct } from "@/lib/collections-data";
import { WhatsAppIcon } from "@/components/Header";
import { useCart } from "@/context/CartContext";

interface ProductShowcaseProps {
  products: CatalogProduct[];
  tabs: { slug: string; name: string }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function ProductShowcase({
  products,
  tabs,
  activeTab = "all",
  onTabChange,
}: ProductShowcaseProps) {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const home = useSite().content.home;
  const whatsapp = useWhatsApp();
  const [titleBefore, titleHighlight, titleAfter] = splitHighlight(home.bestsellers_title, home.bestsellers_highlight);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const TABS = [{ id: "all", label: "All Creations" }, ...tabs.map((t) => ({ id: t.slug, label: t.name }))];

  const filteredProducts =
    currentTab === "all"
      ? products
      : products.filter((p) => p.collectionSlug === currentTab);

  const handleAddToCart = (product: CatalogProduct) => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.primaryImage,
        price: product.price,
        originalPrice: product.originalPrice,
        plating: product.plating,
        quantity: 1,
      },
      true
    );
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
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

  if (products.length === 0) return null;

  return (
    <section
      id="bestsellers"
      aria-label="Trending Creations"
      className="border-b border-[#E5DEC9] bg-[#F7F3EB] pt-7 pb-14 sm:pt-9 sm:pb-16 lg:pt-12 lg:pb-20"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header & Section Title */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">
                {home.bestsellers_eyebrow}
              </p>
            </div>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
              {titleBefore}
              {titleHighlight && <span className="italic text-[#8C671A]">{titleHighlight}</span>}
              {titleAfter}
            </h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-[#171717]/75 sm:text-sm xl:text-[15px] xl:font-semibold xl:text-[#171717]/85 2xl:text-base">
              {home.bestsellers_text}
            </p>
          </div>

          {/* WhatsApp Direct Help Concierge */}
          <a
            href={whatsapp(home.bestsellers_whatsapp_message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#8C671A]/40 bg-white px-4 py-2 text-xs font-semibold text-[#171717] shadow-xs transition hover:border-[#8C671A] hover:bg-[#8C671A] hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#8C671A] group-hover:text-white" />
            <span>{home.bestsellers_whatsapp_label}</span>
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
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#171717] shadow-xs active:scale-90"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Next product"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#171717] shadow-xs active:scale-90"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products 2-Card Slider on Mobile, 4-Column Widescreen-Responsive Grid on Desktop */}
        <div
          ref={sliderRef}
          className="mt-3 flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-2 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5 xl:gap-6 2xl:gap-7 sm:overflow-visible sm:pb-0"
        >
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative flex shrink-0 w-[calc(50%-6px)] snap-start flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B27] hover:shadow-lg sm:w-auto sm:shrink"
              >
                {/* 1. Edge-to-Edge Clean Image linking to Product Detail Page */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] lg:aspect-[10/9]"
                >
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 24vw, (min-width: 640px) 50vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* 2. Ultra-Compact 2-Line White Strip (Zero Truncation, Full Title Visibility) */}
                <div className="flex flex-col justify-between bg-white px-2 py-1.5 sm:px-3.5 sm:py-3 xl:px-4 xl:py-3.5">
                  {/* Line 1: 100% Full-Width Product Name (No Truncation) */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-sans text-[10.5px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#111111] transition-colors hover:text-[#8C671A] sm:text-[13.5px] sm:leading-snug sm:tracking-[-0.01em] xl:text-[15px] 2xl:text-[16px]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Line 2: Left Price + Right Compact "+ Add" (Mobile) / "+ Add to Cart" (sm+) */}
                  <div className="mt-1 flex items-center justify-between gap-1.5 sm:mt-1.5 sm:gap-2 xl:mt-2">
                    <div className="flex items-baseline gap-1 sm:gap-1.5 xl:gap-2">
                      <span className="font-sans text-[12.5px] font-bold text-[#111111] sm:text-[15.5px] xl:text-[17px] 2xl:text-[18.5px]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="font-sans text-[9.5px] font-medium text-[#171717]/65 line-through sm:text-xs xl:text-[13px] xl:font-semibold xl:text-[#171717]/75 2xl:text-[14px]">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`shrink-0 rounded-full px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 sm:px-3.5 sm:py-1.5 sm:text-[10.5px] xl:px-4 xl:py-2 xl:text-[11.5px] 2xl:px-4.5 2xl:text-xs ${
                        addedId === product.id
                          ? "bg-[#107C41] text-white"
                          : "bg-[#111111] text-white hover:bg-[#8C671A]"
                      }`}
                    >
                      {addedId === product.id ? (
                        "✓ Added"
                      ) : (
                        <>
                          <span className="sm:hidden">+ Add</span>
                          <span className="hidden sm:inline">+ Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
