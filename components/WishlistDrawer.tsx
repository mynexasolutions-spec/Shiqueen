"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useWishlist, type WishlistItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

function HeartEmptySvg() {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function WishlistDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem } = useCart();

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

  const handleMoveToBag = (item: WishlistItem) => {
    if (!item.inStock) return;
    addItem(
      {
        id: item.id,
        slug: item.slug,
        name: item.name,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        plating: item.plating,
        quantity: 1,
      },
      true
    );
    closeDrawer();
  };

  const inStockItems = items.filter((i) => i.inStock);

  const handleAddAllToBag = () => {
    if (!inStockItems.length) return;
    inStockItems.forEach((item, idx) => {
      addItem(
        {
          id: item.id,
          slug: item.slug,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          plating: item.plating,
          quantity: 1,
        },
        idx === inStockItems.length - 1
      );
    });
    closeDrawer();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist Drawer"
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
                Your Wishlist
              </h2>
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#8C671A]">
                Saved Favorites • Quick Move to Bag
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DEC9] bg-[#FAF7F2] text-lg font-semibold text-[#171717] transition hover:bg-[#171717] hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Wishlist Items List */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E5DEC9] bg-white shadow-xs">
              <HeartEmptySvg />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-[#171717]">
              Your wishlist is empty
            </h3>
            <p className="mt-1.5 max-w-xs text-xs font-medium leading-relaxed text-[#171717]/70 xl:text-[13px] xl:font-semibold xl:text-[#171717]/82">
              Tap the heart icon on any piece you love to save it here for later.
            </p>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-6 rounded-full bg-[#171717] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
            >
              Explore Jewelry
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-[#E5DEC9] overflow-y-auto px-5 py-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3.5 py-4">
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
                        {item.plating && (
                          <p className="mt-0.5 text-[11px] font-medium text-[#171717]/70">
                            Finish:{" "}
                            <span className="font-semibold text-[#171717]">{item.plating}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from wishlist`}
                        className="text-xs text-[#171717]/45 transition hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-sans text-sm font-bold text-[#111111]">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="ml-1.5 text-[11px] font-medium text-[#171717]/65 line-through">
                            ₹{item.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMoveToBag(item)}
                        disabled={!item.inStock}
                        className="rounded-full bg-[#111111] px-3.5 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#8C671A] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#171717]/40"
                      >
                        {item.inStock ? "+ Add to Cart" : "Sold out"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-[#E5DEC9] bg-white p-5 shadow-[0_-6px_24px_rgba(0,0,0,0.05)]">
              <div className="space-y-2.5">
                {inStockItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddAllToBag}
                    className="flex w-full items-center justify-center rounded-full bg-[#111111] py-3.5 text-center text-xs font-semibold uppercase tracking-widest text-white shadow-md transition hover:bg-[#8C671A]"
                  >
                    Add All to Bag ({inStockItems.length})
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearWishlist}
                  className="flex w-full items-center justify-center rounded-full border border-[#E5DEC9] bg-[#FAF7F2] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171717]/75 transition hover:border-red-300 hover:text-red-600"
                >
                  Clear Wishlist
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
