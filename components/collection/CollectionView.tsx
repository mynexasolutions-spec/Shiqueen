"use client";

import { useState, useMemo } from "react";
import type { CollectionMeta, CatalogProduct } from "@/lib/collections-data";
import CollectionHeader from "./CollectionHeader";
import ProductCard from "./ProductCard";

interface CollectionViewProps {
  collection: CollectionMeta;
  initialProducts: CatalogProduct[];
}

type SortOption = "featured" | "price-low" | "price-high" | "rating";

export default function CollectionView({
  collection,
  initialProducts,
}: CollectionViewProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [selectedPlating, setSelectedPlating] = useState<string>("All");

  const platings = useMemo(() => {
    const list = new Set<string>();
    initialProducts.forEach((p) => list.add(p.plating));
    return ["All", ...Array.from(list)];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by Subcategory
    if (activeSubcategory !== "All") {
      list = list.filter((p) => p.subcategory.toLowerCase() === activeSubcategory.toLowerCase());
    }

    // Filter by Plating
    if (selectedPlating !== "All") {
      list = list.filter((p) => p.plating === selectedPlating);
    }

    // Sort
    if (sortOption === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [initialProducts, activeSubcategory, selectedPlating, sortOption]);

  return (
    <div>
      {/* Header with Subcategory Chips */}
      <CollectionHeader
        collection={collection}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={setActiveSubcategory}
        totalCount={filteredProducts.length}
      />

      <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 sm:py-10 lg:px-12 xl:px-16 2xl:px-20">
        {/* Sticky Filter & Sort Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5DEC9] bg-white p-3.5 shadow-xs sm:p-4">
          {/* Left: Product count & Plating filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-[#171717]">
              Showing <span className="text-[#8C671A]">{filteredProducts.length}</span> pieces
            </span>

            {platings.length > 2 && (
              <div className="hidden items-center gap-1.5 border-l border-[#E5DEC9] pl-3 sm:flex">
                <span className="text-[11px] font-medium text-[#171717]/70 xl:text-xs xl:font-semibold xl:text-[#171717]/82">Finish:</span>
                {platings.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPlating(p)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition xl:text-[11px] ${
                      selectedPlating === p
                        ? "bg-[#8C671A] text-white"
                        : "bg-[#FAF7F2] text-[#171717]/75 hover:bg-[#E5DEC9] xl:font-bold"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-medium text-[#171717]/70 xl:text-[13px] xl:font-semibold xl:text-[#171717]/82">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="rounded-lg border border-[#E5DEC9] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#171717] focus:border-[#8C671A] focus:outline-hidden"
            >
              <option value="featured">Featured / Bestseller</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-5 xl:gap-6 2xl:gap-7">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} eager={i < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E5DEC9] bg-white py-16 text-center">
            <span className="text-3xl">✨</span>
            <h3 className="mt-3 font-serif text-lg font-semibold text-[#171717]">
              No pieces match this filter
            </h3>
            <p className="mt-1 text-xs text-[#171717]/60">
              Try switching back to &ldquo;All&rdquo; or clear your selected filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveSubcategory("All");
                setSelectedPlating("All");
              }}
              className="mt-4 rounded-full bg-[#171717] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#8C671A]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
