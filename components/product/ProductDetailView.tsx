"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  type CatalogProduct,
  type CollectionMeta,
  type ProductSpecItem,
  type ProductReview,
} from "@/lib/collections-data";
import { SOCIAL_LINKS } from "@/lib/brand-data";
import { useCart, GIFT_WRAP_PRICE } from "@/context/CartContext";
import { WhatsAppIcon } from "@/components/Header";
import ProductCard from "@/components/collection/ProductCard";

interface ProductDetailViewProps {
  product: CatalogProduct;
  collection?: CollectionMeta;
  specifications: ProductSpecItem[];
  initialReviews: ProductReview[];
  relatedProducts: CatalogProduct[];
}

const FINISH_OPTIONS = [
  {
    name: "18K Gold Plated",
    swatchBg: "linear-gradient(135deg, #E6C665 0%, #B38728 50%, #FBF5B7 100%)",
  },
  {
    name: "Rose Gold",
    swatchBg: "linear-gradient(135deg, #F3C6B6 0%, #C88A78 50%, #FADCD2 100%)",
  },
  {
    name: "Silver",
    swatchBg: "linear-gradient(135deg, #E2E5E8 0%, #9FA6AD 50%, #F5F7FA 100%)",
  },
] as const;

const COUPON_OFFERS = [
  {
    id: "b1g1",
    saveLabel: "Save ₹800",
    headline: "Get each piece at 50% value",
    body: "Buy 1 Get 1 FREE — add any 2 pieces, pay for 1",
    subtext: "+ Extra 10% OFF on prepaid orders",
    code: "B1G1QUEEN",
  },
  {
    id: "flat50",
    saveLabel: "Save ₹1,200",
    headline: "Royal Bundle Privilege",
    body: "Buy 3 or more & get FLAT 50% OFF on every piece",
    subtext: "+ Free Keepsake Box on orders above ₹1,999",
    code: "ROYAL50",
  },
  {
    id: "new50",
    saveLabel: "Save ₹50",
    headline: "Welcome Queen Offer",
    body: "Extra ₹50 OFF on your first purchase. Use code NEW50",
    subtext: "+ Extra 10% OFF on UPI / Prepaid orders",
    code: "NEW50",
  },
] as const;

/* ============================================================================
 * BESPOKE LUXURY SVG ICON SUITE (100% Vector, Zero Emojis)
 * ========================================================================== */

function StarRow({
  rating = 5,
  size = "sm",
}: {
  rating?: number;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div
      className="inline-flex items-center gap-0.5 text-[#C59B27]"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          fill={star <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={cls}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function SparkleSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 3v4M21 5h-4" />
    </svg>
  );
}

function ZoomExpandSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function GiftBoxSvg({ className = "h-4 w-4" }: { className?: string }) {
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

function TagOfferSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function RefreshExchangeSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TruckDeliverySvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function LockSecureSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MapPinTrackSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShieldCheckSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function LayersPlatingSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function RulerSizeSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
    </svg>
  );
}

function LinkClaspSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function DropletWaterproofSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function CheckSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XCrossSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DiamondGemSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M6 3h12l4 6-10 12L2 9Z" />
      <path d="M11 3 8 9l4 12 4-12-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}

function ClockDispatchSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function AwardCertSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function BriefcaseStyleSvg({ className = "h-4 w-4" }: { className?: string }) {
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CameraPhotoSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ThumbUpSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function FilterSlidersSvg({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function SpecIcon({ index }: { index: number }) {
  const cls = "h-4 w-4 text-[#8C671A]";
  switch (index) {
    case 0:
      return <SparkleSvg className={cls} />;
    case 1:
      return <LayersPlatingSvg className={cls} />;
    case 2:
      return <ShieldCheckSvg className={cls} />;
    case 3:
      return <RulerSizeSvg className={cls} />;
    case 4:
      return <LinkClaspSvg className={cls} />;
    default:
      return <DropletWaterproofSvg className={cls} />;
  }
}

export default function ProductDetailView({
  product,
  collection,
  specifications,
  initialReviews,
  relatedProducts,
}: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();

  // Exactly 2 curated images per product: 1. Studio Shot, 2. On-Model / Hover Shot
  const galleryImages = useMemo(
    () => [
      {
        src: product.primaryImage,
        label: "Studio Close-Up",
        alt: `${product.name} — Studio View`,
      },
      {
        src: product.hoverImage || product.primaryImage,
        label: "On-Model Look",
        alt: `${product.name} — On-Model Lifestyle View`,
      },
    ],
    [product.primaryImage, product.hoverImage, product.name]
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomModalIndex, setZoomModalIndex] = useState<number | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string>(product.plating);
  const [quantity, setQuantity] = useState<number>(1);
  const [giftWrap, setGiftWrap] = useState<boolean>(false);
  const [giftMessage, setGiftMessage] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Pincode checker state
  const [pincode, setPincode] = useState<string>("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  // Sticky bar visibility on scroll
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Product detail tabs state (Description | Specifications | Shipping & Care)
  const [activeDetailTab, setActiveDetailTab] = useState<
    "description" | "specifications" | "shipping_care"
  >("description");

  // Reviews interactive state
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [activeReviewTab, setActiveReviewTab] = useState<"product" | "store">(
    "product"
  );
  const [showReviewFilters, setShowReviewFilters] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | "all" | "photos">(
    "all"
  );
  const [reviewSort, setReviewSort] = useState<
    "pictures" | "recent" | "highest" | "helpful"
  >("pictures");
  const [helpfulClickedIds, setHelpfulClickedIds] = useState<
    Record<string, boolean>
  >({});

  // Write a review form state
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewLocation, setNewReviewLocation] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewBody, setNewReviewBody] = useState("");
  const [reviewSubmittedBanner, setReviewSubmittedBanner] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 520);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const savings = Math.max(0, product.originalPrice - product.price);
  const discountPercent = Math.round((savings / product.originalPrice) * 100);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pincode.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setPincodeResult("Please enter a valid 6-digit Indian pincode.");
      return;
    }
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formatted = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setPincodeResult(
      `Express Delivery by ${formatted} to ${cleaned} • Free Shipping & COD Available`
    );
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.primaryImage,
        price: product.price,
        originalPrice: product.originalPrice,
        plating: selectedFinish,
        quantity,
        giftWrap,
        giftMessage: giftWrap ? giftMessage.trim() : undefined,
      },
      true
    );
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.primaryImage,
        price: product.price,
        originalPrice: product.originalPrice,
        plating: selectedFinish,
        quantity,
        giftWrap,
        giftMessage: giftWrap ? giftMessage.trim() : undefined,
      },
      false
    );
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    const giftNote = giftWrap ? ` + Special Gift Wrap (₹${GIFT_WRAP_PRICE})` : "";
    const text = `Hi Shiqueen! I want to order "${product.name}" (${selectedFinish}) × ${quantity} — ₹${(
      product.price * quantity +
      (giftWrap ? GIFT_WRAP_PRICE * quantity : 0)
    ).toLocaleString("en-IN")}${giftNote}. Please share instant checkout details.`;
    window.open(SOCIAL_LINKS.whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  const filteredAndSortedReviews = useMemo(() => {
    let list = [...reviews];
    if (ratingFilter === "photos") {
      list = list.filter((r) => r.images && r.images.length > 0);
    } else if (typeof ratingFilter === "number") {
      list = list.filter((r) => r.rating === ratingFilter);
    }

    if (reviewSort === "pictures") {
      list.sort((a, b) => (b.images?.length ?? 0) - (a.images?.length ?? 0));
    } else if (reviewSort === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (reviewSort === "helpful") {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }
    return list;
  }, [reviews, ratingFilter, reviewSort]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewBody.trim()) return;
    const initials = newReviewName
      .trim()
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const created: ProductReview = {
      id: `custom-${Date.now()}`,
      author: newReviewName.trim(),
      initials: initials || "SQ",
      location: newReviewLocation.trim() || "India",
      date: "Just now",
      rating: newReviewRating,
      verified: true,
      title: newReviewTitle.trim() || "Loved this piece from Shiqueen!",
      body: newReviewBody.trim(),
      helpfulCount: 1,
      variantPurchased: selectedFinish,
    };

    setReviews((prev) => [created, ...prev]);
    setNewReviewName("");
    setNewReviewLocation("");
    setNewReviewTitle("");
    setNewReviewBody("");
    setShowWriteReview(false);
    setReviewSubmittedBanner(true);
    setTimeout(() => setReviewSubmittedBanner(false), 4000);
  };

  return (
    <div className="bg-[#FAF7F2] text-[#171717]">
      {/* 0. Swashaa-Inspired Promotional Marquee Pill Strip */}
      <div className="border-b border-[#E5DEC9] bg-[#EFE8E4] py-2.5">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#171717] sm:text-xs">
          <span>
            BUY 1 GET 1 <span className="text-[#B91C1C]">FREE</span> SITEWIDE
          </span>
          <SparkleSvg className="hidden h-3 w-3 text-[#8C671A] sm:inline" />
          <span>
            BUY <span className="text-[#B91C1C]">3</span> OR MORE GET FLAT{" "}
            <span className="text-[#B91C1C]">50% OFF</span>
          </span>
          <SparkleSvg className="hidden h-3 w-3 text-[#8C671A] sm:inline" />
          <span>
            EXTRA <span className="text-[#B91C1C]">10% OFF</span> ON PREPAID ORDERS
          </span>
        </div>
      </div>

      {/* 1. Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-[1760px] px-4 pt-4 pb-2 sm:px-6 lg:px-12 xl:px-16 2xl:px-20"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#171717]/70 xl:text-[13px] xl:font-semibold xl:text-[#171717]/80 2xl:text-sm">
          <li>
            <Link href="/" className="transition hover:text-[#8C671A]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {collection && (
            <>
              <li>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="transition hover:text-[#8C671A]"
                >
                  {collection.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li className="font-semibold text-[#171717] 2xl:font-bold">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* 2. TOP HERO: Height-Balanced 1-Main-Image Gallery (Left) + Spacious Evenly-Distributed Checkout Card (Right) */}
      <section className="mx-auto max-w-[1760px] px-4 py-4 sm:px-6 sm:py-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-8 xl:gap-10 2xl:gap-12">
          {/* LEFT COLUMN (7 Cols): 1 Clean Full-Width Main Image + Bottom Click-Only Switching Tabs */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-7">
            <div>
              {/* Single Clean Full-Width Hero Image Frame (No Arrows, No Badges) */}
              <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs sm:aspect-[5/4] lg:aspect-[4/3]">
                {/* Main Active Image */}
                <Image
                  src={galleryImages[activeImageIndex].src}
                  alt={galleryImages[activeImageIndex].alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  priority
                  onClick={() => setZoomModalIndex(activeImageIndex)}
                  className="cursor-zoom-in object-cover object-center transition-all duration-500"
                />

                {/* Subtle Zoom Trigger Button in Bottom-Right */}
                <button
                  type="button"
                  onClick={() => setZoomModalIndex(activeImageIndex)}
                  aria-label="Open full-screen zoom view"
                  className="absolute right-3.5 bottom-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#171717] shadow-md backdrop-blur-xs transition hover:bg-[#171717] hover:text-white sm:right-4 sm:bottom-4 sm:h-10 sm:w-10 xl:h-11 xl:w-11"
                >
                  <ZoomExpandSvg className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom 2-Image Switching Tabs (Click-Only, Mobile-Responsive) */}
              <div
                role="tablist"
                aria-label="Product Image Views"
                className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-3.5 sm:gap-3.5 xl:mt-4 xl:gap-4"
              >
                {galleryImages.map((img, idx) => {
                  const isSelected = activeImageIndex === idx;
                  return (
                    <button
                      key={img.label}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`flex items-center justify-between gap-2 rounded-2xl border p-2 text-left transition sm:gap-3 sm:p-2.5 xl:p-3.5 ${
                        isSelected
                          ? "border-[#111111] bg-white shadow-xs ring-1 ring-[#111111]"
                          : "border-[#E5DEC9] bg-white/75 opacity-80 hover:border-[#8C671A] hover:opacity-100"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] sm:h-15 sm:w-15 xl:h-18 xl:w-18">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#8C671A] sm:text-[10px] sm:tracking-[0.16em] xl:text-[11px]">
                            0{idx + 1} • {isSelected ? "Active" : "Switch"}
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold leading-tight text-[#111111] sm:text-sm xl:text-[15px]">
                            {img.label}
                          </p>
                          <p className="mt-0.5 hidden text-[10px] font-medium text-[#171717]/65 sm:block xl:text-xs xl:font-semibold xl:text-[#171717]/80">
                            {isSelected ? "Currently viewing" : "Click to switch view"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:inline-block xl:px-3 xl:text-[11px] ${
                          isSelected
                            ? "bg-[#111111] text-white"
                            : "bg-[#FAF7F2] text-[#171717]/75 xl:font-semibold xl:text-[#171717]"
                        }`}
                      >
                        {isSelected ? "Active" : "View"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Below-Gallery Anti-Tarnish Assurance Banner */}
            <div className="hidden rounded-2xl border border-[#E5DEC9] bg-white px-5 py-3.5 shadow-xs lg:flex lg:items-center lg:justify-between xl:px-6 xl:py-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5DEC9] bg-[#FAF7F2] text-[#8C671A] xl:h-11 xl:w-11">
                  <ShieldCheckSvg className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#171717] xl:text-[13px]">
                    Shiqueen 18K PVD Anti-Tarnish Promise
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-[#171717]/70 xl:text-[13px] xl:font-semibold xl:text-[#171717]/82">
                    100% Waterproof, Sweatproof &amp; Hypoallergenic — Crafted for daily Indian wear.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EFE8E4] px-3 py-1 text-[11px] font-semibold text-[#8C671A] xl:px-3.5 xl:py-1.5 xl:text-xs xl:font-bold">
                <CheckSvg className="h-3 w-3" />
                <span>Lab Verified</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols): Spacious Evenly-Distributed Checkout Card (No Cramped Top, No Empty Bottom Gap) */}
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs sm:p-6 lg:col-span-5 xl:gap-5 xl:p-8 2xl:gap-6 2xl:p-10">
            {/* Block 1: Title, Eyebrow & Rating Summary */}
            <div className="border-b border-[#E5DEC9] pb-4 xl:pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C671A] xl:text-xs">
                {collection?.name ?? "Shiqueen Signature"} • {product.subcategory}
              </p>
              <h1 className="mt-1.5 font-serif text-2xl font-bold leading-tight text-[#111111] sm:text-3xl xl:text-[34px] 2xl:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 xl:mt-4">
                <a
                  href="#customer-reviews"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] transition hover:text-[#8C671A] xl:text-[13px] 2xl:text-sm"
                >
                  <StarRow rating={product.rating} size="md" />
                  <span>
                    {product.rating.toFixed(1)} | {reviews.length} Verified Reviews
                  </span>
                </a>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EA] px-3 py-1 text-[11px] font-semibold text-[#137333] xl:px-3.5 xl:py-1.5 xl:text-xs xl:font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#137333]" />
                  In stock, ready to ship
                </span>
              </div>
            </div>

            {/* Block 2: Price & Tax Note */}
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-sans text-2xl font-bold text-[#111111] sm:text-3xl xl:text-[32px] 2xl:text-4xl">
                  Rs. {product.price.toLocaleString("en-IN")}.00
                </span>
                <span className="font-sans text-sm font-medium text-[#757575] line-through sm:text-base xl:text-lg xl:font-semibold xl:text-[#171717]/60">
                  Rs. {product.originalPrice.toLocaleString("en-IN")}.00
                </span>
                <span className="rounded-full bg-[#111111] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FAF6EE] xl:text-xs">
                  Save ₹{savings.toLocaleString("en-IN")} ({discountPercent}% OFF)
                </span>
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-[#171717]/65 xl:text-xs xl:font-semibold xl:text-[#171717]/80 2xl:text-[13px]">
                Inclusive of all taxes • Free Express Pan-India Shipping
              </p>
            </div>

            {/* Block 3: Color / Finish Swatch Selector */}
            <div>
              <span className="text-xs font-medium text-[#171717]/75 xl:text-[13px] xl:font-semibold xl:text-[#171717]/85 2xl:text-sm">
                Color / Finish:{" "}
                <strong className="font-bold text-[#111111]">
                  {selectedFinish}
                </strong>
              </span>
              <div className="mt-2.5 flex flex-wrap items-center gap-2.5 xl:mt-3 xl:gap-3">
                {FINISH_OPTIONS.map((opt) => {
                  const active = selectedFinish === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setSelectedFinish(opt.name)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition xl:px-4 xl:py-2.5 xl:text-[13px] 2xl:text-sm ${
                        active
                          ? "border-[#111111] bg-[#FAF7F2] font-bold text-[#111111] ring-1 ring-[#111111]"
                          : "border-[#E5DEC9] bg-white text-[#171717]/75 hover:border-[#8C671A] xl:font-semibold xl:text-[#171717]/85"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/15 xl:h-4.5 xl:w-4.5"
                        style={{ background: opt.swatchBg }}
                      />
                      <span>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Block 4: Gift Wrap Add-On Checkbox */}
            <div className="rounded-2xl border border-[#E5DEC9] bg-[#EFE8E4]/65 p-3.5 xl:p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="h-4 w-4 rounded border-[#8C671A] accent-[#111111] xl:h-4.5 xl:w-4.5"
                  />
                  <GiftBoxSvg className="h-4 w-4 shrink-0 text-[#8C671A] xl:h-5 xl:w-5" />
                  <span className="text-xs font-semibold text-[#111111] xl:text-[13px] 2xl:text-sm">
                    Is it a gift? Make it Special{" "}
                    <span className="whitespace-nowrap font-bold">
                      (Rs. {GIFT_WRAP_PRICE})
                    </span>
                  </span>
                </div>
                <span className="hidden rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#8C671A] sm:inline xl:text-[11px]">
                  Keepsake Wrap
                </span>
              </label>

              {giftWrap && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write a heartfelt message for the gift card (optional)..."
                    className="w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2.5 text-xs font-medium text-[#171717] placeholder:text-[#171717]/50 focus:border-[#8C671A] focus:outline-hidden xl:text-[13px] xl:font-semibold"
                  />
                </div>
              )}
            </div>

            {/* Block 5: Quantity Stepper + ADD TO CART + Secondary Checkout Row */}
            <div className="space-y-3 xl:space-y-3.5">
              <div className="flex items-center gap-3 xl:gap-4">
                <div className="inline-flex h-12 items-center rounded-full border border-[#171717]/25 bg-white px-2.5 xl:h-13 2xl:h-14">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-[#171717] transition hover:bg-[#FAF7F2] disabled:opacity-35 xl:h-9 xl:w-9"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm font-bold text-[#111111] xl:min-w-10 xl:text-base">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-[#171717] transition hover:bg-[#FAF7F2] xl:h-9 xl:w-9"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#111111] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition hover:bg-[#8C671A] active:scale-[0.99] xl:h-13 xl:text-[13px] 2xl:h-14 2xl:text-sm"
                >
                  ADD TO CART
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:gap-3.5">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex h-11 items-center justify-center rounded-full border border-[#111111] bg-[#FAF7F2] px-4 text-xs font-bold uppercase tracking-wider text-[#111111] transition hover:bg-[#111111] hover:text-white xl:h-12 xl:text-[12.5px] 2xl:h-13 2xl:text-[13px]"
                >
                  Buy It Now • Express
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#1E7E34]/40 bg-[#E6F4EA]/70 px-4 text-xs font-bold uppercase tracking-wider text-[#137333] transition hover:bg-[#137333] hover:text-white xl:h-12 xl:text-[12.5px] 2xl:h-13 2xl:text-[13px]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Block 6: Pincode Delivery Estimator */}
            <form onSubmit={handleCheckPincode}>
              <label
                htmlFor="pincode-input"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#171717]/70 xl:text-xs xl:font-bold xl:text-[#171717]/85"
              >
                <MapPinTrackSvg className="h-3.5 w-3.5 text-[#8C671A] xl:h-4 xl:w-4" />
                <span>Check Express Delivery &amp; COD Availability</span>
              </label>
              <div className="mt-2 flex gap-2.5">
                <input
                  id="pincode-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 400001)"
                  className="flex-1 rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-4 py-2.5 text-xs font-medium text-[#171717] placeholder:text-[#171717]/50 focus:border-[#8C671A] focus:outline-hidden xl:py-3 xl:text-[13px] xl:font-semibold xl:placeholder:text-[#171717]/60"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#EFE8E4] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171717] transition hover:bg-[#171717] hover:text-white xl:px-6 xl:py-3 xl:text-[13px]"
                >
                  Check
                </button>
              </div>
              {pincodeResult && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#137333] xl:text-[13px]">
                  <CheckSvg className="h-3.5 w-3.5" />
                  <span>{pincodeResult}</span>
                </p>
              )}
            </form>

            {/* Block 7: 4 Luxury SVG Trust Badges Grid */}
            <div className="grid grid-cols-2 gap-2.5 border-t border-[#E5DEC9] pt-4 sm:grid-cols-4 xl:gap-3 xl:pt-5">
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-2.5 text-center xl:p-3">
                <RefreshExchangeSvg className="h-4 w-4 text-[#8C671A] xl:h-5 xl:w-5" />
                <span className="mt-1.5 text-[10px] font-semibold leading-tight text-[#171717] xl:text-[11px] xl:font-bold">
                  3-day exchange policy
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-2.5 text-center xl:p-3">
                <TruckDeliverySvg className="h-4 w-4 text-[#8C671A] xl:h-5 xl:w-5" />
                <span className="mt-1.5 text-[10px] font-semibold leading-tight text-[#171717] xl:text-[11px] xl:font-bold">
                  Delivery Guaranteed
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-2.5 text-center xl:p-3">
                <LockSecureSvg className="h-4 w-4 text-[#8C671A] xl:h-5 xl:w-5" />
                <span className="mt-1.5 text-[10px] font-semibold leading-tight text-[#171717] xl:text-[11px] xl:font-bold">
                  Secure Transaction
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-2.5 text-center xl:p-3">
                <MapPinTrackSvg className="h-4 w-4 text-[#8C671A] xl:h-5 xl:w-5" />
                <span className="mt-1.5 text-[10px] font-semibold leading-tight text-[#171717] xl:text-[11px] xl:font-bold">
                  Easy Order Tracking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MIDDLE ROW 1: Full-Width Horizontal Ticket Offers Strip (3 Columns) */}
      <section className="mx-auto max-w-[1760px] px-4 py-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs sm:p-6 xl:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3.5">
            <div className="flex items-center gap-2">
              <TagOfferSvg className="h-4 w-4 text-[#8C671A] xl:h-5 xl:w-5" />
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#111111] sm:text-sm xl:text-[15px]">
                Exclusive Sitewide Offers &amp; Coupons
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-[#8C671A] xl:text-xs xl:font-bold">
              Click any code to copy for checkout
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-3 xl:gap-5">
            {COUPON_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2] p-4 transition hover:border-[#C59B27] xl:p-5"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#111111] px-2.5 py-0.5 text-[10px] font-bold text-white xl:text-[11px]">
                      {offer.saveLabel}
                    </span>
                    <span className="text-xs font-bold text-[#8C671A] xl:text-[13px]">
                      {offer.headline}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#171717] xl:text-[13.5px] xl:font-bold">
                    {offer.body}
                  </p>
                  <p className="text-[11px] font-medium text-[#171717]/70 xl:text-xs xl:font-semibold xl:text-[#171717]/82">
                    {offer.subtext}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(offer.code)}
                  className="shrink-0 rounded-xl border border-dashed border-[#8C671A] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#171717] transition hover:bg-[#171717] hover:text-white xl:px-4 xl:py-2.5 xl:text-xs"
                >
                  {copiedCode === offer.code ? (
                    <span className="inline-flex items-center gap-1 text-[#137333]">
                      <CheckSvg className="h-3 w-3" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    offer.code
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MIDDLE ROW 2: Single-Line 3-Tab Bar + Rich Visual & Tabular Product Experience */}
      <section className="mx-auto max-w-[1760px] px-4 py-6 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="overflow-hidden rounded-3xl border border-[#E5DEC9] bg-white shadow-xs">
          {/* Top Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DEC9] bg-[#FAF7F2]/75 px-6 py-4 sm:px-8 lg:px-10 xl:py-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif text-xl font-bold text-[#111111] sm:text-2xl xl:text-[26px] 2xl:text-3xl">
                Product Information
              </h2>
              <span className="hidden text-xs font-bold uppercase tracking-[0.2em] text-[#8C671A] sm:inline xl:text-[13px]">
                • Craftsmanship, Specifications &amp; Care
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DEC9] bg-white px-3.5 py-1 text-[11px] font-bold text-[#171717] shadow-2xs xl:px-4 xl:py-1.5 xl:text-xs">
              <ShieldCheckSvg className="h-3.5 w-3.5 text-[#8C671A] xl:h-4 xl:w-4" />
              <span>18K PVD Anti-Tarnish Verified</span>
            </span>
          </div>

          {/* Guaranteed Single-Line 3-Tab Switcher Bar (Full Text on 360px Mobile, Zero Truncation) */}
          <div
            role="tablist"
            aria-label="Product Information Tabs"
            className="grid grid-cols-3 border-b border-[#E5DEC9] bg-[#EFE8E4]/45"
          >
            {[
              {
                id: "description" as const,
                step: "01",
                mobileLabel: "Description",
                label: "Description & Styling",
                sub: "Story, Pairing & Unboxing",
                icon: <SparkleSvg className="h-4 w-4 shrink-0 xl:h-4.5 xl:w-4.5" />,
              },
              {
                id: "specifications" as const,
                step: "02",
                mobileLabel: "Specifications",
                label: "Specifications & Quality",
                sub: "Tech Sheet & PVD Comparison",
                icon: <DiamondGemSvg className="h-4 w-4 shrink-0 xl:h-4.5 xl:w-4.5" />,
              },
              {
                id: "shipping_care" as const,
                step: "03",
                mobileLabel: "Shipping & Care",
                label: "Shipping & Care Guide",
                sub: "Timeline, Exchange & Do's/Don'ts",
                icon: <TruckDeliverySvg className="h-4 w-4 shrink-0 xl:h-4.5 xl:w-4.5" />,
              },
            ].map((tab) => {
              const isActive = activeDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveDetailTab(tab.id)}
                  className={`group relative flex items-center justify-center gap-2 border-r border-[#E5DEC9] px-1.5 py-3.5 text-center transition last:border-r-0 sm:justify-center sm:gap-2.5 sm:px-5 sm:py-4.5 sm:text-left xl:gap-3.5 xl:py-5 ${
                    isActive
                      ? "bg-white text-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                      : "bg-transparent text-[#171717]/70 hover:bg-[#FAF7F2] hover:text-[#111111] xl:text-[#171717]/80"
                  }`}
                >
                  {/* Top Active Gold Indicator Line */}
                  {isActive && (
                    <span className="absolute inset-x-0 top-0 h-[3px] bg-[#8C671A]" />
                  )}

                  <span
                    className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition sm:flex sm:h-9 sm:w-9 xl:h-10 xl:w-10 ${
                      isActive
                        ? "border-[#111111] bg-[#111111] text-[#FAF6EE]"
                        : "border-[#E5DEC9] bg-white text-[#8C671A] group-hover:border-[#8C671A]"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center justify-center gap-1 sm:justify-start sm:gap-1.5">
                      <span className="hidden text-[10px] font-bold uppercase tracking-widest text-[#8C671A] sm:inline xl:text-[11px]">
                        {tab.step}
                      </span>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider sm:hidden">
                        {tab.mobileLabel}
                      </span>
                      <span className="hidden truncate text-xs font-bold uppercase tracking-[0.12em] sm:inline sm:text-[13px] xl:text-sm 2xl:text-[15px]">
                        {tab.label}
                      </span>
                    </div>
                    <p className="hidden truncate text-[11px] font-medium text-[#171717]/65 md:block xl:text-xs xl:font-semibold xl:text-[#171717]/82">
                      {tab.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Panel Content Area */}
          <div className="p-4 sm:p-8 lg:p-10 xl:p-12">
            {/* ================================================================
             * TAB 1: DESCRIPTION, STYLING GUIDE & VISUAL UNBOXING
             * ============================================================== */}
            {activeDetailTab === "description" && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start xl:gap-10">
                {/* Left 6 Cols: Editorial Story + Live Finish Vibe + 3 Styling Occasion Cards */}
                <div className="space-y-6 lg:col-span-6 xl:space-y-7">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C671A] xl:px-4 xl:py-1.5 xl:text-xs">
                      <SparkleSvg className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                      <span>Design Story &amp; Craftsmanship</span>
                    </div>

                    <h3 className="mt-3 font-serif text-2xl font-bold text-[#111111] xl:text-[28px] 2xl:text-3xl">
                      {product.name}
                    </h3>

                    <p className="mt-2.5 text-sm font-medium leading-relaxed text-[#171717]/75 xl:text-[15px] xl:font-semibold xl:leading-7 xl:text-[#171717]/85 2xl:text-base">
                      {product.description}
                    </p>
                  </div>

                  {/* Interactive Finish Vibe Card */}
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/80 p-4 xl:p-5">
                    <div className="flex items-center gap-3.5">
                      <span
                        className="h-10 w-10 shrink-0 rounded-full border border-black/15 shadow-inner xl:h-11 xl:w-11"
                        style={{
                          background:
                            FINISH_OPTIONS.find((f) => f.name === selectedFinish)
                              ?.swatchBg ?? FINISH_OPTIONS[0].swatchBg,
                        }}
                      />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C671A] xl:text-xs">
                          Selected Finish Vibe • {selectedFinish}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#111111] sm:text-sm xl:text-[15px] xl:font-bold">
                          {selectedFinish === "Rose Gold"
                            ? "Soft Romantic Blush — Complements warm & neutral undertones"
                            : selectedFinish === "Silver"
                              ? "Crisp Mirror Rhodium — Sleek minimal high-shine finish"
                              : "Rich 18K Golden Glow — Universally flatters Indian skin tones"}
                        </p>
                      </div>
                    </div>
                    <span className="hidden shrink-0 rounded-full border border-[#E5DEC9] bg-white px-3 py-1 text-[11px] font-bold text-[#111111] sm:inline-block xl:px-3.5 xl:py-1.5 xl:text-xs">
                      PVD Locked
                    </span>
                  </div>

                  {/* "How To Style It" — 3 Occasion Cards with Bespoke SVGs */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111111] xl:text-[13px]">
                      Style Guide — How Queens Wear It
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 xl:gap-4">
                      <div className="rounded-2xl border border-[#E5DEC9] bg-white p-3.5 transition hover:border-[#8C671A] xl:p-4">
                        <div className="flex items-center gap-2 text-[#8C671A]">
                          <BriefcaseStyleSvg className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] xl:text-xs">
                            Work &amp; Office
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium leading-snug text-[#171717]/75 xl:mt-2 xl:text-[13px] xl:font-semibold xl:text-[#171717]/85">
                          Pairs effortlessly with crisp linen shirts, blazers &amp; everyday kurtis.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E5DEC9] bg-white p-3.5 transition hover:border-[#8C671A] xl:p-4">
                        <div className="flex items-center gap-2 text-[#8C671A]">
                          <SparkleSvg className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] xl:text-xs">
                            Date Night
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium leading-snug text-[#171717]/75 xl:mt-2 xl:text-[13px] xl:font-semibold xl:text-[#171717]/85">
                          Catches candlelight beautifully on V-necklines, slip dresses &amp; tops.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E5DEC9] bg-white p-3.5 transition hover:border-[#8C671A] xl:p-4">
                        <div className="flex items-center gap-2 text-[#8C671A]">
                          <DiamondGemSvg className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] xl:text-xs">
                            Festive Stack
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium leading-snug text-[#171717]/75 xl:mt-2 xl:text-[13px] xl:font-semibold xl:text-[#171717]/85">
                          Ready-made layered look that elevates sarees &amp; Indo-western fits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 6 Cols: Organized Highlights Table + "Inside Your Shiqueen Box" Visual Grid */}
                <div className="space-y-6 lg:col-span-6 xl:space-y-7">
                  {/* Structured Highlights Table */}
                  <div className="overflow-hidden rounded-2xl border border-[#E5DEC9]">
                    <div className="flex items-center justify-between border-b border-[#E5DEC9] bg-[#FAF7F2] px-5 py-3.5 xl:px-6 xl:py-4">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#111111] xl:text-[13px]">
                        Key Craftsmanship Highlights
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8C671A] xl:text-xs">
                        <ShieldCheckSvg className="h-4 w-4" />
                        <span>100% Verified</span>
                      </span>
                    </div>

                    <div className="divide-y divide-[#E5DEC9]">
                      {product.features.map((feat, index) => (
                        <div
                          key={feat}
                          className={`flex items-center justify-between px-5 py-3 text-xs sm:text-sm xl:px-6 xl:py-3.5 xl:text-[15px] ${
                            index % 2 === 0 ? "bg-white" : "bg-[#FAF7F2]/45"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFE8E4] text-[11px] font-bold text-[#8C671A] xl:h-7 xl:w-7 xl:text-xs">
                              0{index + 1}
                            </span>
                            <span className="font-semibold text-[#111111] xl:font-bold">
                              {feat}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2.5 py-0.5 text-[11px] font-semibold text-[#137333] xl:px-3 xl:py-1 xl:text-xs xl:font-bold">
                            <CheckSvg className="h-3 w-3" />
                            <span>Verified</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* "What Comes Inside Your Shiqueen Box" 2x2 Visual Unboxing Grid */}
                  <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/60 p-4 sm:p-5 xl:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <GiftBoxSvg className="h-4 w-4 shrink-0 text-[#8C671A] xl:h-4.5 xl:w-4.5" />
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#111111] xl:text-[13px]">
                          Inside Your Shiqueen Package
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wider text-[#8C671A] xl:text-xs">
                        ✦ Free With Every Order
                      </span>
                    </div>

                    <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:mt-4 xl:gap-4">
                      {[
                        {
                          title: "Signature Keepsake Box",
                          desc: "Rigid magnetic luxury gift box",
                          icon: <GiftBoxSvg className="h-4 w-4 text-[#8C671A]" />,
                        },
                        {
                          title: "Anti-Tarnish Travel Pouch",
                          desc: "Soft velvet zip pouch for storage",
                          icon: <ShieldCheckSvg className="h-4 w-4 text-[#8C671A]" />,
                        },
                        {
                          title: "Microfiber Polishing Cloth",
                          desc: "Keeps mirror-shine intact for years",
                          icon: <SparkleSvg className="h-4 w-4 text-[#8C671A]" />,
                        },
                        {
                          title: "Authenticity & Care Card",
                          desc: "18K PVD quality assurance certificate",
                          icon: <AwardCertSvg className="h-4 w-4 text-[#8C671A]" />,
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-start gap-3 rounded-xl border border-[#E5DEC9] bg-white p-3 xl:p-3.5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E5DEC9] bg-[#FAF7F2] xl:h-9 xl:w-9">
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#111111] xl:text-[13.5px]">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium text-[#171717]/70 xl:text-xs xl:font-semibold xl:text-[#171717]/82">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================
             * TAB 2: TECHNICAL SPECIFICATIONS + SHIQUEEN VS ORDINARY COMPARISON
             * ============================================================== */}
            {activeDetailTab === "specifications" && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start xl:gap-10">
                {/* Left 7 Cols: Structured Technical Spec Sheet Table + Comfort Meters */}
                <div className="space-y-4 lg:col-span-7 xl:space-y-5">
                  <div className="overflow-hidden rounded-2xl border border-[#E5DEC9]">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] bg-[#FAF7F2] px-5 py-3.5 xl:px-6 xl:py-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#111111] xl:text-[13px]">
                          Technical Specification Sheet
                        </h3>
                        <p className="mt-0.5 text-[11px] font-medium text-[#171717]/70 xl:text-xs xl:font-semibold xl:text-[#171717]/82">
                          Exact dimensions, base metal &amp; coating specifications
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DEC9] bg-white px-3 py-1 text-[11px] font-bold text-[#8C671A] xl:px-3.5 xl:py-1.5 xl:text-xs">
                        <ShieldCheckSvg className="h-3.5 w-3.5" />
                        <span>316L Surgical Grade</span>
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <tbody className="divide-y divide-[#E5DEC9] text-xs sm:text-sm xl:text-[15px]">
                          {specifications.map((spec, idx) => (
                            <tr
                              key={spec.label}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-[#FAF7F2]/50"
                              }
                            >
                              <td className="w-2/5 px-5 py-3.5 xl:px-6 xl:py-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E5DEC9] bg-[#FAF7F2] xl:h-8 xl:w-8">
                                    <SpecIcon index={idx} />
                                  </span>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C671A] sm:text-xs xl:text-[13px]">
                                    {spec.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 font-semibold text-[#111111] xl:px-6 xl:py-4 xl:font-bold">
                                {spec.label === "Color / Finish"
                                  ? selectedFinish
                                  : spec.value}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-white">
                            <td className="px-5 py-3.5 xl:px-6 xl:py-4">
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E5DEC9] bg-[#FAF7F2] xl:h-8 xl:w-8">
                                  <ShieldCheckSvg className="h-4 w-4 text-[#8C671A]" />
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C671A] sm:text-xs xl:text-[13px]">
                                  Skin Safety
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-[#111111] xl:px-6 xl:py-4 xl:font-bold">
                              100% Hypoallergenic — Nickel, Lead &amp; Cadmium Free
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2 Visual Quality Meters Below Spec Table */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:gap-4">
                    <div className="flex items-center justify-between rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/70 p-4 xl:p-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C671A] xl:text-[11px]">
                          Comfort Weight Feel
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#111111] sm:text-sm xl:text-[15px]">
                          Featherlight • Zero Neck Strain
                        </p>
                      </div>
                      <span className="rounded-full bg-[#111111] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white xl:px-3.5 xl:py-1.5 xl:text-[11px]">
                        24/7 Wear
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/70 p-4 xl:p-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C671A] xl:text-[11px]">
                          Water Resistance Grade
                        </p>
                        <p className="mt-1 text-xs font-bold text-[#111111] sm:text-sm xl:text-[15px]">
                          5/5 Rating • Shower &amp; Sweat Proof
                        </p>
                      </div>
                      <StarRow rating={5} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: "Shiqueen 18K PVD vs Ordinary Brass Jewelry" Comparison Matrix */}
                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white">
                    <div className="border-b border-[#E5DEC9] bg-[#111111] px-5 py-4 text-white xl:px-6 xl:py-5">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C59B27] xl:text-xs">
                        <AwardCertSvg className="h-4 w-4" />
                        <span>The Shiqueen Difference</span>
                      </div>
                      <h3 className="mt-1 font-serif text-lg font-bold text-white xl:text-xl">
                        Shiqueen 18K PVD vs. Regular Jewelry
                      </h3>
                    </div>

                    <table className="w-full border-collapse text-left text-xs xl:text-[13px]">
                      <thead>
                        <tr className="border-b border-[#E5DEC9] bg-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider text-[#171717]/75 xl:text-[11px] xl:text-[#171717]/85">
                          <th className="px-4 py-3 xl:px-5 xl:py-3.5">Quality Factor</th>
                          <th className="px-3 py-3 text-center text-[#137333] xl:py-3.5">
                            Shiqueen PVD
                          </th>
                          <th className="px-3 py-3 text-center text-[#B91C1C] xl:py-3.5">
                            Ordinary Brass
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5DEC9]">
                        {[
                          {
                            feature: "Water & Sweat Safe",
                            shiqueen: "100% Shower Safe",
                            ordinary: "Turns black in days",
                          },
                          {
                            feature: "Skin Reaction",
                            shiqueen: "Zero Green Marks",
                            ordinary: "Itchy / Green skin",
                          },
                          {
                            feature: "Shine Lifespan",
                            shiqueen: "2–3+ Years Daily",
                            ordinary: "Fades in 2 weeks",
                          },
                          {
                            feature: "Core Metal",
                            shiqueen: "316L Surgical Steel",
                            ordinary: "Cheap Alloy / Brass",
                          },
                          {
                            feature: "Perfume Tolerance",
                            shiqueen: "High PVD Seal",
                            ordinary: "Instant tarnish",
                          },
                        ].map((row, idx) => (
                          <tr
                            key={row.feature}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-[#FAF7F2]/45"
                            }
                          >
                            <td className="px-4 py-3.5 font-bold text-[#111111] xl:px-5 xl:py-4">
                              {row.feature}
                            </td>
                            <td className="px-3 py-3.5 text-center xl:py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2.5 py-1 text-[11px] font-bold text-[#137333] xl:px-3 xl:text-xs">
                                <CheckSvg className="h-3 w-3 shrink-0" />
                                <span>{row.shiqueen}</span>
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-center xl:py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2]/70 px-2.5 py-1 text-[11px] font-semibold text-[#B91C1C] xl:px-3 xl:text-xs xl:font-bold">
                                <XCrossSvg className="h-3 w-3 shrink-0" />
                                <span>{row.ordinary}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================
             * TAB 3: VISUAL DELIVERY TIMELINE + CARE DO'S & DON'TS
             * ============================================================== */}
            {activeDetailTab === "shipping_care" && (
              <div className="space-y-6 xl:space-y-7">
                {/* Top Strip: 3-Step Visual Express Delivery Timeline */}
                <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/70 p-5 xl:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3.5">
                    <div className="flex items-center gap-2">
                      <TruckDeliverySvg className="h-4 w-4 text-[#8C671A] xl:h-4.5 xl:w-4.5" />
                      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#111111] sm:text-sm xl:text-[15px]">
                        Fast-Track Pan-India Delivery Journey
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EA] px-3 py-1 text-[11px] font-bold text-[#137333] xl:px-3.5 xl:py-1.5 xl:text-xs">
                      <CheckSvg className="h-3 w-3" />
                      <span>Free Express Shipping &amp; COD Available</span>
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 xl:gap-5">
                    {[
                      {
                        step: "Step 01 • Today",
                        title: "Instant Order Confirmation",
                        desc: "Order locked immediately with live WhatsApp & SMS tracking link.",
                        icon: <LockSecureSvg className="h-4 w-4 text-[#8C671A]" />,
                      },
                      {
                        step: "Step 02 • Within 24 Hours",
                        title: "2-Stage Quality Check & Dispatch",
                        desc: "Hand-inspected for finish perfection & packed in Shiqueen keepsake box.",
                        icon: <ClockDispatchSvg className="h-4 w-4 text-[#8C671A]" />,
                      },
                      {
                        step: "Step 03 • 1–3 Working Days",
                        title: "Express Doorstep Delivery",
                        desc: "Delivered via BlueDart / Delhivery Air + 3-Day Easy Exchange window.",
                        icon: <TruckDeliverySvg className="h-4 w-4 text-[#8C671A]" />,
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex items-start gap-3.5 rounded-xl border border-[#E5DEC9] bg-white p-4 shadow-2xs xl:p-5"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] xl:h-10 xl:w-10">
                          {item.icon}
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C671A] xl:text-[11px]">
                            {item.step}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-[#111111] sm:text-sm xl:text-[15px]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs font-medium leading-relaxed text-[#171717]/75 xl:text-[13px] xl:font-semibold xl:text-[#171717]/85">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Split: Left Policy Table + Right Do's & Don'ts Care Matrix */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
                  {/* Left 5 Cols: Shipping & Exchange Policy Summary Table */}
                  <div className="overflow-hidden rounded-2xl border border-[#E5DEC9] lg:col-span-5">
                    <div className="flex items-center gap-2 border-b border-[#E5DEC9] bg-[#FAF7F2] px-5 py-3.5 xl:px-6 xl:py-4">
                      <RefreshExchangeSvg className="h-4 w-4 text-[#8C671A]" />
                      <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#111111] xl:text-[13px]">
                        Shipping &amp; Exchange Policy
                      </h4>
                    </div>
                    <table className="w-full border-collapse text-left text-xs sm:text-sm xl:text-[14.5px]">
                      <tbody className="divide-y divide-[#E5DEC9]">
                        <tr className="bg-white">
                          <th className="w-2/5 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#8C671A] xl:px-6 xl:py-4 xl:text-xs">
                            Metro Delivery
                          </th>
                          <td className="px-5 py-3.5 font-semibold text-[#111111] xl:px-6 xl:py-4 xl:font-bold">
                            1–3 Working Days Express Air
                          </td>
                        </tr>
                        <tr className="bg-[#FAF7F2]/50">
                          <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#8C671A] xl:px-6 xl:py-4 xl:text-xs">
                            Rest of India
                          </th>
                          <td className="px-5 py-3.5 font-semibold text-[#111111] xl:px-6 xl:py-4 xl:font-bold">
                            3–5 Working Days (26,000+ Pincodes)
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#8C671A] xl:px-6 xl:py-4 xl:text-xs">
                            Prepaid Benefit
                          </th>
                          <td className="px-5 py-3.5 font-semibold text-[#137333] xl:px-6 xl:py-4 xl:font-bold">
                            Free Shipping + Extra 10% OFF
                          </td>
                        </tr>
                        <tr className="bg-[#FAF7F2]/50">
                          <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#8C671A] xl:px-6 xl:py-4 xl:text-xs">
                            Exchange Policy
                          </th>
                          <td className="px-5 py-3.5 font-semibold text-[#111111] xl:px-6 xl:py-4 xl:font-bold">
                            3-Day Doorstep Pickup &amp; Instant Replacement
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right 7 Cols: Green DO'S vs Coral DON'TS Care Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 xl:gap-5">
                    {/* DO'S Card */}
                    <div className="rounded-2xl border border-[#137333]/25 bg-[#E6F4EA]/35 p-5 xl:p-6">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#137333] text-white xl:h-8 xl:w-8">
                          <CheckSvg className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#137333] xl:text-[13px]">
                            Jewelry Care Do&apos;s
                          </h4>
                          <p className="text-[11px] font-medium text-[#171717]/75 xl:text-xs xl:font-semibold xl:text-[#171717]/85">
                            How to keep 18K shine forever
                          </p>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-2.5 text-xs font-semibold text-[#111111] xl:text-[13.5px]">
                        {[
                          "Wear freely in shower, gym sweat & monsoon rain",
                          "Apply perfume & lotions first, let dry 60 secs before wearing",
                          "Wipe gently with the complimentary microfiber cloth after wear",
                          "Store flat inside the Shiqueen zip-pouch when travelling",
                        ].map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <CheckSvg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#137333] xl:mt-1 xl:h-4 xl:w-4" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* DON'TS Card */}
                    <div className="rounded-2xl border border-[#B91C1C]/20 bg-[#FEE2E2]/25 p-5 xl:p-6">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B91C1C] text-white xl:h-8 xl:w-8">
                          <XCrossSvg className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#B91C1C] xl:text-[13px]">
                            Care Don&apos;ts
                          </h4>
                          <p className="text-[11px] font-medium text-[#171717]/75 xl:text-xs xl:font-semibold xl:text-[#171717]/85">
                            Things to avoid for scratch protection
                          </p>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-2.5 text-xs font-semibold text-[#111111] xl:text-[13.5px]">
                        {[
                          "Don't spray concentrated alcohol perfume directly onto the chain",
                          "Don't toss loose with sharp metal keys or coins without a pouch",
                          "Don't use harsh chemical silver dips or abrasive brushes",
                          "Don't pull delicate layered chains forcefully while unclasping",
                        ].map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <XCrossSvg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B91C1C] xl:mt-1 xl:h-4 xl:w-4" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Editorial "FEATURED IN" Warm Beige Strip (Swashaa Style) */}
      <section className="my-8 border-y border-[#E5DEC9] bg-[#EFE8E4] py-8">
        <div className="mx-auto max-w-[1760px] px-4 text-center sm:px-6 lg:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C671A] xl:text-xs">
            Loved By Fashion Editors &amp; 50,000+ Queens
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-[#111111] xl:text-3xl">
            <span className="swashaa-highlight">FEATURED IN</span>
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20">
            {["WEDDING VOWS", "MANIFEST", "FEMINA", "ELLE INDIA", "HELLO!"].map(
              (pub) => (
                <span
                  key={pub}
                  className="font-serif text-lg font-bold tracking-[0.18em] text-[#171717]/80 sm:text-xl xl:text-2xl"
                >
                  {pub}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Section (Swashaa Judge.me Style — 100% SVG Icons) */}
      <section
        id="customer-reviews"
        className="mx-auto max-w-[1760px] scroll-mt-24 px-4 py-8 sm:px-6 lg:px-12 xl:px-16 2xl:px-20"
      >
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-wide text-[#111111] sm:text-4xl">
            <span className="swashaa-highlight">CUSTOMER REVIEWS</span>
          </h2>
        </div>

        <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-5 shadow-xs sm:p-8">
          {/* Top Summary Row */}
          <div className="flex flex-col items-start justify-between gap-6 border-b border-[#E5DEC9] pb-6 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-serif text-4xl font-bold text-[#111111]">
                    {product.rating.toFixed(1)}
                  </span>
                  <div>
                    <StarRow rating={product.rating} size="md" />
                    <p className="mt-0.5 text-xs font-medium text-[#171717]/70 xl:text-[13px] xl:font-semibold xl:text-[#171717]/82">
                      Based on {product.reviewCount} verified reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Uploaded Photos Strip */}
              <div className="border-l border-[#E5DEC9] pl-6">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8C671A]">
                  <CameraPhotoSvg className="h-3.5 w-3.5" />
                  <span>Customer Photos ({galleryImages.length})</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {galleryImages.map((img, i) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setZoomModalIndex(i)}
                      className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#E5DEC9] transition hover:scale-105 hover:border-[#8C671A]"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Write a Review Black Pill CTA */}
            <button
              type="button"
              onClick={() => setShowWriteReview((v) => !v)}
              className="rounded-full bg-[#111111] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
            >
              {showWriteReview ? "Cancel Review" : "Write a review"}
            </button>
          </div>

          {/* Interactive Write a Review Form */}
          {showWriteReview && (
            <form
              onSubmit={handleSubmitReview}
              className="mt-6 rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2] p-5"
            >
              <h3 className="font-serif text-xl font-bold text-[#111111]">
                Share Your Experience with {product.name}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="e.g. Smita Sharma"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newReviewLocation}
                    onChange={(e) => setNewReviewLocation(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    Rating
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2 text-xs font-semibold focus:border-[#8C671A] focus:outline-hidden"
                  >
                    <option value={5}>5 Stars — Loved It</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Good</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#171717]">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Cute dainty piece! Zero tarnish"
                  className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2 text-xs focus:border-[#8C671A] focus:outline-hidden"
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#171717]">
                  Your Review *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReviewBody}
                  onChange={(e) => setNewReviewBody(e.target.value)}
                  placeholder="Tell other Queens about the shine, comfort, or gifting experience..."
                  className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2 text-xs focus:border-[#8C671A] focus:outline-hidden"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#111111] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          )}

          {reviewSubmittedBanner && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#E6F4EA] px-4 py-3 text-xs font-semibold text-[#137333]">
              <CheckSvg className="h-4 w-4" />
              <span>Thank you! Your review has been added below.</span>
            </div>
          )}

          {/* Tabs + Filters & Sort Row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveReviewTab("product")}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-xs ${
                  activeReviewTab === "product"
                    ? "bg-[#111111] text-white"
                    : "bg-[#FAF7F2] text-[#171717]/70 hover:text-[#111111]"
                }`}
              >
                Product reviews ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveReviewTab("store")}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-xs ${
                  activeReviewTab === "store"
                    ? "bg-[#111111] text-white"
                    : "bg-[#FAF7F2] text-[#171717]/70 hover:text-[#111111]"
                }`}
              >
                Store reviews (440+)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowReviewFilters((f) => !f)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#111111] bg-[#111111] px-4 py-1.5 text-xs font-semibold text-white transition hover:border-[#8C671A] hover:bg-[#8C671A]"
              >
                <FilterSlidersSvg className="h-3.5 w-3.5" />
                <span>Filters</span>
              </button>

              <select
                aria-label="Sort reviews"
                value={reviewSort}
                onChange={(e) =>
                  setReviewSort(
                    e.target.value as "pictures" | "recent" | "highest" | "helpful"
                  )
                }
                className="rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-4 py-1.5 text-xs font-semibold text-[#171717] focus:border-[#8C671A] focus:outline-hidden"
              >
                <option value="pictures">Sort: Pictures First</option>
                <option value="recent">Sort: Most Recent</option>
                <option value="highest">Sort: Highest Rating</option>
                <option value="helpful">Sort: Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Expandable Rating Filter Pills */}
          {showReviewFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-[#FAF7F2] p-3.5">
              <span className="mr-2 text-xs font-semibold text-[#171717]/70">
                Filter by:
              </span>
              {[
                { key: "all" as const, label: "All Reviews" },
                { key: "photos" as const, label: "With Photos" },
                { key: 5 as const, label: "5 Stars" },
                { key: 4 as const, label: "4 Stars" },
              ].map((pill) => (
                <button
                  key={String(pill.key)}
                  type="button"
                  onClick={() => setRatingFilter(pill.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                    ratingFilter === pill.key
                      ? "bg-[#111111] text-white"
                      : "border border-[#E5DEC9] bg-white text-[#171717] hover:border-[#8C671A]"
                  }`}
                >
                  {pill.key === "photos" && (
                    <CameraPhotoSvg className="h-3 w-3" />
                  )}
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Review Cards Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">
            {filteredAndSortedReviews.map((rev) => (
              <article
                key={rev.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]/60 p-4 sm:p-5 xl:p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFE8E4] font-serif text-sm font-bold text-[#8C671A] xl:h-11 xl:w-11">
                        {rev.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-[#111111] xl:text-sm">
                            {rev.author}
                          </span>
                          {rev.verified && (
                            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#137333] xl:text-[10px]">
                              <CheckSvg className="h-2.5 w-2.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-[#171717]/65 xl:text-xs xl:font-semibold xl:text-[#171717]/80">
                          {rev.location} • {rev.date}
                        </p>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <StarRow rating={rev.rating} />
                    </div>
                  </div>

                  {/* Mobile Star Rating Row (Prevents overflowing card border on 360px screens) */}
                  <div className="mt-2.5 sm:hidden">
                    <StarRow rating={rev.rating} />
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-[#111111] sm:mt-3.5 xl:text-base">
                    {rev.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#171717]/75 xl:text-[13.5px] xl:font-semibold xl:text-[#171717]/85">
                    {rev.body}
                  </p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="mt-3.5 flex items-center gap-2.5">
                      {rev.images.map((imgUrl, idx) => (
                        <button
                          key={`${rev.id}-img-${idx}`}
                          type="button"
                          onClick={() =>
                            setZoomModalIndex(idx % galleryImages.length)
                          }
                          className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#E5DEC9] bg-white transition hover:scale-105 xl:h-18 xl:w-18"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Customer photo by ${rev.author}`}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-[#E5DEC9] bg-white px-3 py-2 xl:px-4 xl:py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-[#E5DEC9]">
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[10.5px] font-medium leading-tight text-[#171717]/75 sm:text-[11px] xl:text-xs xl:font-semibold xl:text-[#171717]/85">
                      Review for{" "}
                      <strong className="font-bold text-[#111111]">
                        {product.name}
                      </strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setHelpfulClickedIds((prev) => ({
                        ...prev,
                        [rev.id]: !prev[rev.id],
                      }))
                    }
                    className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold transition xl:px-3 xl:text-[11px] ${
                      helpfulClickedIds[rev.id]
                        ? "bg-[#111111] text-white"
                        : "bg-[#FAF7F2] text-[#171717]/75 hover:text-[#111111] xl:font-bold"
                    }`}
                  >
                    <ThumbUpSvg className="h-3 w-3 shrink-0" />
                    <span>
                      Helpful ({rev.helpfulCount + (helpfulClickedIds[rev.id] ? 1 : 0)})
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Cross-Sell Section: "YOU MAY ALSO LIKE" */}
      <section className="mx-auto max-w-[1760px] px-4 py-10 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C671A]">
              Complete Your Royal Look
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#111111] sm:text-3xl">
              <span className="swashaa-highlight">YOU MAY ALSO LIKE</span>
            </h2>
          </div>
          {collection && (
            <Link
              href={`/collections/${collection.slug}`}
              className="text-xs font-bold uppercase tracking-wider text-[#8C671A] transition hover:text-[#111111]"
            >
              View All
            </Link>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* 8. Swashaa-Style Sticky Floating Bottom-Right Add-to-Cart Bar (Desktop Only — Hidden on Mobile) */}
      {showStickyBar && (
        <div className="fixed right-8 bottom-6 z-40 hidden items-center gap-3.5 rounded-2xl border border-[#E5DEC9] bg-white/95 p-3 shadow-2xl backdrop-blur-md lg:flex">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9]">
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#111111]">{product.name}</p>
            <p className="text-[11px] text-[#171717]/65">
              {selectedFinish} •{" "}
              <strong className="text-[#111111]">
                Rs. {product.price.toLocaleString("en-IN")}
              </strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-[#111111] px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
          >
            ADD TO CART
          </button>
        </div>
      )}

      {/* 9. Full-Screen Image Zoom Modal (For the 2 Product Images) */}
      {zoomModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setZoomModalIndex(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomModalIndex(null)}
              aria-label="Close zoom modal"
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-[#111111] shadow-md transition hover:bg-[#111111] hover:text-white"
            >
              ×
            </button>

            <div className="relative aspect-[3/4] max-h-[75vh] w-full overflow-hidden rounded-2xl bg-[#FAF7F2]">
              <Image
                src={galleryImages[zoomModalIndex].src}
                alt={galleryImages[zoomModalIndex].alt}
                fill
                sizes="(min-width: 768px) 640px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-3 flex items-center justify-between px-2">
              <span className="text-xs font-bold text-[#171717]">
                {galleryImages[zoomModalIndex].label} ({zoomModalIndex + 1} of 2)
              </span>
              <div className="flex gap-2">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setZoomModalIndex(i)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      zoomModalIndex === i
                        ? "bg-[#111111] text-white"
                        : "bg-[#FAF7F2] text-[#171717]"
                    }`}
                  >
                    {i + 1}. {img.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
