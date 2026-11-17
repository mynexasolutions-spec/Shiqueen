"use client";

import Link from "next/link";
import type { CollectionMeta } from "@/lib/collections-data";

interface CollectionHeaderProps {
  collection: CollectionMeta;
  activeSubcategory: string;
  onSelectSubcategory: (sub: string) => void;
  totalCount: number;
}

export default function CollectionHeader({
  collection,
  activeSubcategory,
  onSelectSubcategory,
  totalCount,
}: CollectionHeaderProps) {
  return (
    <div className="border-b border-[#E5DEC9] bg-[#FAF7F2] py-8 sm:py-12">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#171717]/60">
          <Link href="/" className="transition hover:text-[#8C671A]">
            Home
          </Link>
          <span>/</span>
          <Link href="/#categories" className="transition hover:text-[#8C671A]">
            Collections
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#171717]">{collection.name}</span>
        </nav>

        {/* Collection Title & Pitch */}
        <div className="mt-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8C671A]/30 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C671A] shadow-xs backdrop-blur-xs">
            <span>✨ {collection.badge}</span>
            <span>•</span>
            <span>{totalCount} Designs</span>
          </div>

          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
            {collection.name}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[#171717]/70 sm:text-base">
            {collection.description}
          </p>
        </div>

        {/* Swashaa-style Subcategory Quick Chips Carousel */}
        {collection.subcategories && collection.subcategories.length > 1 && (
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:gap-2.5">
            {collection.subcategories.map((sub) => {
              const isActive = activeSubcategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSelectSubcategory(sub)}
                  className={`inline-flex shrink-0 items-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#171717] text-white shadow-md"
                      : "border border-[#E5DEC9] bg-white text-[#171717]/80 hover:border-[#8C671A] hover:text-[#171717]"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
