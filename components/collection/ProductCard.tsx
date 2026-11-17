"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/collections-data";
import { SOCIAL_LINKS } from "@/lib/brand-data";
import { WhatsAppIcon } from "@/components/Header";

interface ProductCardProps {
  product: CatalogProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleBuyOnWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = `Hi Shiqueen! I would like to order "${product.name}" (₹${product.price.toLocaleString("en-IN")}). Please confirm availability and shipping details.`;
    window.open(SOCIAL_LINKS.whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-[#E5DEC9] bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B27] hover:shadow-xl sm:p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1:1 Aspect Image Container with Dual-Image Swap */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#FAF7F2]">
        {/* Primary Image (Studio) */}
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-cover object-center transition-all duration-500 ease-out ${
            isHovered ? "scale-105 opacity-0" : "scale-100 opacity-100"
          }`}
        />

        {/* Hover Image (On-Model / Lifestyle) */}
        <Image
          src={product.hoverImage}
          alt={`${product.name} on model`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-cover object-center transition-all duration-500 ease-out ${
            isHovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
          }`}
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-2.5 sm:top-2.5">
          {product.badge && (
            <span className="rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#171717] shadow-xs backdrop-blur-xs sm:text-[10px]">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-full bg-[#8C671A] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs sm:text-[10px]">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#171717] shadow-sm backdrop-blur-xs transition hover:scale-110 hover:bg-white sm:right-2.5 sm:top-2.5"
        >
          <svg
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "fill-none text-[#171717]"
            }`}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-2.5 bottom-2.5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inset-x-3 sm:bottom-3">
          <button
            type="button"
            onClick={handleBuyOnWhatsApp}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#171717] py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#8C671A] sm:text-[11px]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
            <span>WhatsApp Buy</span>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#171717] shadow-md transition hover:bg-[#FAF7F2] sm:text-[11px]"
          >
            {isAdded ? "Added ✓" : "+ Cart"}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Rating & Review */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#171717]/70">
            <span className="flex items-center text-[#8C671A]">
              ★ <span className="ml-0.5 font-semibold text-[#171717]">{product.rating}</span>
            </span>
            <span className="text-[#171717]/40">•</span>
            <span className="text-[10px] text-[#171717]/60">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <h3 className="mt-1 font-serif text-sm font-semibold text-[#171717] line-clamp-2 transition-colors group-hover:text-[#8C671A] sm:text-base">
            {product.name}
          </h3>

          {/* Subcategory & Plating pill */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-[#FAF7F2] px-2 py-0.5 text-[9px] font-medium text-[#171717]/70">
              {product.subcategory}
            </span>
            <span className="rounded-md bg-[#FAF7F2] px-2 py-0.5 text-[9px] font-medium text-[#8C671A]">
              {product.plating}
            </span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-3 flex items-baseline justify-between border-t border-[#F0EAE1] pt-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#171717] sm:text-lg">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-[#171717]/50 line-through sm:text-sm">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <span className="text-[10px] font-semibold text-[#8C671A]">
            Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
