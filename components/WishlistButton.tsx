"use client";

import { useWishlist, type WishlistItem } from "@/context/WishlistContext";

interface WishlistButtonProps {
  product: WishlistItem;
  className?: string;
}

export default function WishlistButton({ product, className = "" }: WishlistButtonProps) {
  const { isWishlisted, toggleItem } = useWishlist();
  const saved = isWishlisted(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={saved}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-105 hover:bg-white active:scale-90 sm:h-9 sm:w-9 ${
        saved ? "text-[#B58924]" : "text-[#171717]/80 hover:text-[#8C671A]"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
