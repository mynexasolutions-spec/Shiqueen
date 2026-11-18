"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/collections-data";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: CatalogProduct;
  /** Load immediately (first row of a grid — likely the largest image on screen). */
  eager?: boolean;
}

export default function ProductCard({ product, eager = false }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
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
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B27] hover:shadow-lg">
      {/* 1. Clean Edge-to-Edge Image linking to Product Description Page */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] lg:aspect-[10/9]"
      >
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1536px) 22vw, (min-width: 1024px) 24vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </Link>

      {/* 2. Ultra-Compact 2-Line White Strip (Zero Truncation, Full Title Visibility) */}
      <div className="flex flex-col justify-between bg-white px-2 py-1.5 sm:px-3.5 sm:py-3 xl:px-4 xl:py-3.5">
        {/* Line 1: 100% Full-Width Product Name (No Truncation) */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-sans text-[10.5px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#111111] transition-colors group-hover:text-[#8C671A] sm:text-[13.5px] sm:leading-snug sm:tracking-[-0.01em] xl:text-[15px] 2xl:text-[16px]">
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
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`disabled:cursor-not-allowed disabled:!bg-[#171717]/40shrink-0 rounded-full px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 sm:px-3.5 sm:py-1.5 sm:text-[10.5px] xl:px-4 xl:py-2 xl:text-[11.5px] 2xl:px-4.5 2xl:text-xs ${
              isAdded
                ? "bg-[#107C41] text-white"
                : "bg-[#111111] text-white hover:bg-[#8C671A]"
            }`}
          >
            {!product.inStock ? (
              "Sold out"
            ) : isAdded ? (
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
}
