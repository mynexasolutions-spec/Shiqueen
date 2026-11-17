import { BRAND, SOCIAL_LINKS } from "./brand-data";

export interface CollectionMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  bannerImage: string;
  subcategories: string[];
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  collectionSlug: string;
  subcategory: string;
  primaryImage: string;
  hoverImage: string;
  price: number;
  originalPrice: number;
  badge: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  plating: "18K Gold Plated" | "Rose Gold" | "Silver" | "Antique Gold";
  material: string;
  features: string[];
  description: string;
}

export const COLLECTIONS_DATA: Record<string, CollectionMeta> = {
  necklaces: {
    slug: "necklaces",
    name: "Necklaces & Pendants",
    tagline: "Waterproof, 18K Gold-Plated & Tarnish-Free Chains",
    description:
      "Explore Shiqueen's signature anti-tarnish necklaces crafted in waterproof stainless steel. From everyday layered chains to solitaire pendants, designed to never fade or turn green.",
    badge: "100% Anti-Tarnish",
    bannerImage: "/images/categories/cat-necklaces.jpg",
    subcategories: ["All", "Layered", "Pendants", "Chains", "Chokers"],
  },
  earrings: {
    slug: "earrings",
    name: "Earrings",
    tagline: "Everyday Hoops, Studs & Statement Drops",
    description:
      "Hypoallergenic, sweatproof, and lightweight earrings crafted for sensitive skin. Wear them to the gym, in the shower, or to weddings with complete peace of mind.",
    badge: "Hypoallergenic",
    bannerImage: "/images/categories/cat-earrings.jpg",
    subcategories: ["All", "Hoops", "Studs", "Drops", "Huggie"],
  },
  bracelets: {
    slug: "bracelets",
    name: "Bracelets & Cuffs",
    tagline: "Paperclip Chains, Minimalist Cuffs & Tennis Links",
    description:
      "Demi-fine wristwear finished with heavy 18K gold PVD coating. Stack them with your favorite wristwatch or wear solo for an effortless luxury look.",
    badge: "Waterproof & Sweatproof",
    bannerImage: "/images/categories/cat-bracelets.jpg",
    subcategories: ["All", "Cuffs", "Link Chains", "Tennis"],
  },
  rings: {
    slug: "rings",
    name: "Rings",
    tagline: "Stacking Bands, Solitaires & Adjustable Rings",
    description:
      "Tarnish-proof stacking bands and sparkling solitaire rings. Premium stainless steel prevents green fingers and survives daily soap and water.",
    badge: "Zero Skin Green",
    bannerImage: "/images/categories/cat-rings.jpg",
    subcategories: ["All", "Stacking", "Solitaire", "Bands"],
  },
  watches: {
    slug: "watches",
    name: "Anti-Tarnish Watches",
    tagline: "18K Jubilee Links & Vintage Minimalist Dials",
    description:
      "Demi-fine ladies wristwatches crafted with waterproof stainless steel link bracelets, fluted bezels, and durable PVD gold plating.",
    badge: "Signature Luxe",
    bannerImage: "/images/categories/cat-watches.jpg",
    subcategories: ["All", "Jubilee Link", "Mesh Strap"],
  },
  festive: {
    slug: "festive",
    name: "Festive & Ethnic Sets",
    tagline: "Heirloom Kundan & Natural Pearl Statement Jewellery",
    description:
      "Regal Kundan chokers, jhumkas, and ethnic sets crafted to illuminate weddings, festive milestones, and cultural celebrations.",
    badge: "Royal Festive Edit",
    bannerImage: "/images/categories/cat-festive.jpg",
    subcategories: ["All", "Choker Sets", "Jhumkas", "Bridal"],
  },
  hampers: {
    slug: "hampers",
    name: "Custom Gift Hampers",
    tagline: "Bespoke Keepsake Boxes with Jewelry & Blooms",
    description:
      "Handcrafted luxury gift hampers curated with anti-tarnish jewelry, watches, fairy lights, chocolates & personalized handwritten wax-sealed notes.",
    badge: "Made to Order",
    bannerImage: "/images/categories/cat-hampers.jpg",
    subcategories: ["All", "Gift Boxes", "Bridal Hampers", "Anniversary"],
  },
  bouquets: {
    slug: "bouquets",
    name: "Jewelry Bouquets",
    tagline: "Signature Handcrafted Floral Blooms Nestled with Jewelry",
    description:
      "Shiqueen's viral gifting innovation: romantic everlasting blush silk blooms delicately holding 18K gold necklaces, earrings, and rings.",
    badge: "Signature Gifting",
    bannerImage: "/images/categories/cat-bouquets.jpg",
    subcategories: ["All", "Blush Rose", "Everlasting Blooms"],
  },
};

export const MVP_PRODUCTS: CatalogProduct[] = [
  // 1. Necklaces (3 products)
  {
    id: "aura-triple-bar-necklace",
    slug: "aura-triple-bar-necklace",
    name: "Aura Triple Layered Bar Necklace",
    collectionSlug: "necklaces",
    subcategory: "Layered",
    primaryImage: "/images/products/aura-triple-bar-studio.jpg",
    hoverImage: "/images/products/aura-triple-bar-model.jpg",
    price: 1299,
    originalPrice: 2499,
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 94,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel",
    features: ["18K Gold PVD Plated", "Waterproof & Sweatproof", "Zero Tarnish"],
    description:
      "A stunning triple-layered design featuring a sleek vertical bar pendant and sparkling solitaire crystal. 100% anti-tarnish stainless steel crafted for daily wear.",
  },
  {
    id: "celeste-evil-eye-pendant",
    slug: "celeste-evil-eye-pendant",
    name: "Celeste Mother-of-Pearl Evil Eye Pendant",
    collectionSlug: "necklaces",
    subcategory: "Pendants",
    primaryImage: "/images/products/celeste-evil-eye-studio.jpg",
    hoverImage: "/images/products/celeste-evil-eye-model.jpg",
    price: 1099,
    originalPrice: 2199,
    badge: "Trending",
    rating: 4.8,
    reviewCount: 68,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Mother of Pearl & Stainless Steel",
    features: ["Natural Mother of Pearl", "Sapphire Blue Accent", "Hypoallergenic"],
    description:
      "Delicate protective talisman featuring iridescent natural mother of pearl with a tiny sapphire blue crystal at center on an 18K gold box chain.",
  },
  {
    id: "luxe-snake-herringbone-chain",
    slug: "luxe-snake-herringbone-chain",
    name: "Luxe Liquid Gold Herringbone Snake Chain",
    collectionSlug: "necklaces",
    subcategory: "Chains",
    primaryImage: "/images/categories/cat-necklaces.jpg",
    hoverImage: "/images/hero/hero-jewelry-desktop.jpg",
    price: 999,
    originalPrice: 1999,
    badge: "Waterproof",
    rating: 4.9,
    reviewCount: 112,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel",
    features: ["High-Gloss Polish", "Snag-Free Flexible Links", "Swim-Safe"],
    description:
      "Silky liquid-gold feel that lies flat on your collarbone. Perfect for layering with pendants or wearing as a standalone statement choker.",
  },

  // 2. Earrings (3 products)
  {
    id: "luxe-solitaire-hoops",
    slug: "luxe-solitaire-hoops",
    name: "Luxe Solitaire Stud & Classic Hoop Set",
    collectionSlug: "earrings",
    subcategory: "Hoops",
    primaryImage: "/images/products/luxe-solitaire-hoops-studio.jpg",
    hoverImage: "/images/products/luxe-solitaire-hoops-model.jpg",
    price: 899,
    originalPrice: 1699,
    badge: "Waterproof",
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Hypoallergenic Stainless Steel",
    features: ["Secure Click Closure", "AAA Micro-Zircons", "Zero Skin Itch"],
    description:
      "Timeless everyday duo with comfortable click-closure gold hoops and brilliant faceted solitaire studs. Wear them swimming or partying without color fade.",
  },
  {
    id: "celeste-baroque-pearl-drops",
    slug: "celeste-baroque-pearl-drops",
    name: "Celeste Baroque Pearl Drop Earrings",
    collectionSlug: "earrings",
    subcategory: "Drops",
    primaryImage: "/images/products/celeste-baroque-pearl-studio.jpg",
    hoverImage: "/images/products/celeste-baroque-pearl-model.jpg",
    price: 1199,
    originalPrice: 2299,
    badge: "Editorial Pick",
    rating: 4.7,
    reviewCount: 43,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Freshwater Faux Pearl & Steel",
    features: ["Organic Pearl Shape", "Lightweight Wear", "18K Gold Wires"],
    description:
      "Graceful wire drop earrings featuring organic luminous baroque pearls suspended from gleaming 18K gold posts.",
  },
  {
    id: "aurora-croissant-dome-hoops",
    slug: "aurora-croissant-dome-hoops",
    name: "Aurora Twisted Croissant Dome Hoops",
    collectionSlug: "earrings",
    subcategory: "Hoops",
    primaryImage: "/images/categories/cat-earrings.jpg",
    hoverImage: "/images/hero/hero-jewelry-mobile-v3.jpg",
    price: 949,
    originalPrice: 1899,
    badge: "Trending",
    rating: 4.8,
    reviewCount: 52,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Hollow Lightweight Stainless Steel",
    features: ["Chunky French Dome", "Featherlight Comfort", "Sweat-Resistant"],
    description:
      "The classic French croissant silhouette, puffed and hollowed for all-day comfort without weighing down your earlobes.",
  },

  // 3. Bracelets (2 products)
  {
    id: "eternal-paperclip-cuff",
    slug: "eternal-paperclip-cuff",
    name: "Eternal Paperclip Chain & Ball Cuff Duo",
    collectionSlug: "bracelets",
    subcategory: "Cuffs",
    primaryImage: "/images/categories/cat-bracelets.jpg",
    hoverImage: "/images/products/eternal-paperclip-cuff-model.jpg",
    price: 1199,
    originalPrice: 2199,
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 88,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel",
    features: ["Adjustable Fit", "Anti-Scratch Polish", "Stackable Design"],
    description:
      "Modern paperclip link chain bracelet paired with a sleek minimalist ball-end cuff. Effortlessly chic stacked with watches or worn solo.",
  },
  {
    id: "gleam-solitaire-tennis-bracelet",
    slug: "gleam-solitaire-tennis-bracelet",
    name: "Gleam Solitaire Tennis Bracelet",
    collectionSlug: "bracelets",
    subcategory: "Tennis",
    primaryImage: "/images/products/gleam-tennis-bracelet-studio.jpg",
    hoverImage: "/images/hero/hero-jewelry-desktop-v3.jpg",
    price: 1399,
    originalPrice: 2799,
    badge: "Waterproof",
    rating: 5.0,
    reviewCount: 61,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Bezel Zirconia & Stainless Steel",
    features: ["Bezel-Set Crystals", "Double Safety Clasp", "Never Tarnish"],
    description:
      "A modern bezel-set take on the classic tennis bracelet. Waterproof construction means you never have to take it off.",
  },

  // 4. Rings (2 products)
  {
    id: "starlight-stacking-trio",
    slug: "starlight-stacking-trio",
    name: "Starlight Triple Stacking Ring Trio",
    collectionSlug: "rings",
    subcategory: "Stacking",
    primaryImage: "/images/products/starlight-rings-studio.jpg",
    hoverImage: "/images/products/starlight-rings-model.jpg",
    price: 999,
    originalPrice: 1899,
    badge: "Tarnish-Proof",
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel",
    features: ["Pavé Leaf Band", "Bezel Solitaire", "Eternity Crystal Ring"],
    description:
      "Three complementary stacking bands including a leafy laurel motif, solitaire bezel, and eternity band. Stack all three or style across fingers.",
  },
  {
    id: "verde-baguette-emerald-band",
    slug: "verde-baguette-emerald-band",
    name: "Verde Baguette Emerald Solitaire Band",
    collectionSlug: "rings",
    subcategory: "Solitaire",
    primaryImage: "/images/categories/cat-rings.jpg",
    hoverImage: "/images/hero/hero-festive-desktop.jpg",
    price: 849,
    originalPrice: 1699,
    badge: "New Arrival",
    rating: 4.9,
    reviewCount: 37,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Simulated Emerald & Steel",
    features: ["Deep Forest Green Crystal", "Smooth Comfort Fit", "No Green Finger"],
    description:
      "Minimalist horizontal baguette emerald-cut solitaire ring in an ultra-sleek 18K gold band setting.",
  },

  // 5. Watches (2 products)
  {
    id: "royale-jubilee-watch",
    slug: "royale-jubilee-watch",
    name: "Royale Jubilee 18K Gold Watch",
    collectionSlug: "watches",
    subcategory: "Jubilee Link",
    primaryImage: "/images/categories/cat-watches.jpg",
    hoverImage: "/images/hero/hero-jewelry-desktop-v3.jpg",
    price: 1999,
    originalPrice: 3999,
    badge: "Signature Luxe",
    rating: 4.9,
    reviewCount: 118,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Stainless Steel & Mineral Glass",
    features: ["Gold Jubilee Bracelet", "Pure White Minimal Dial", "Water-Resistant"],
    description:
      "Shiqueen's signature demi-fine ladies wristwatch with fluted bezel, clean index markers, and premium stainless steel link bracelet.",
  },
  {
    id: "petite-emerald-mesh-watch",
    slug: "petite-emerald-mesh-watch",
    name: "Petite Royale Emerald Dial Mesh Watch",
    collectionSlug: "watches",
    subcategory: "Mesh Strap",
    primaryImage: "/images/products/petite-emerald-watch-studio.jpg",
    hoverImage: "/images/products/petite-emerald-watch-model.jpg",
    price: 2199,
    originalPrice: 4299,
    badge: "Vintage Luxe",
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Milanese Mesh & Sunburst Dial",
    features: ["Sunburst Green Dial", "Adjustable Mesh Buckle", "Roman Numerals"],
    description:
      "Vintage-inspired rectangular timepiece with a deep sunburst emerald green face, roman indices, and woven gold Milanese mesh strap.",
  },

  // 6. Festive & Ethnic Sets (1 product)
  {
    id: "noor-kundan-choker-set",
    slug: "noor-kundan-choker-set",
    name: "Noor Kundan & Faux Pearl Choker Set",
    collectionSlug: "festive",
    subcategory: "Choker Sets",
    primaryImage: "/images/products/noor-kundan-choker-studio.jpg",
    hoverImage: "/images/products/noor-kundan-choker-model.jpg",
    price: 2499,
    originalPrice: 4999,
    badge: "Royal Festive Edit",
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    plating: "Antique Gold",
    material: "Handcrafted Kundan & Faux Pearls",
    features: ["Heavy Kundan Choker", "Matching Jhumkas", "Bridal Maangtikka"],
    description:
      "An exquisite heirloom-quality statement set with handcrafted Kundan stones, natural faux pearls, and antique gold plating for festive celebrations.",
  },

  // 7. Gifting Studio (1 product)
  {
    id: "queens-keepsake-hamper",
    slug: "queens-keepsake-hamper",
    name: "The Queen's Keepsake Luxury Gift Box",
    collectionSlug: "hampers",
    subcategory: "Gift Boxes",
    primaryImage: "/images/categories/cat-hampers.jpg",
    hoverImage: "/images/hero/hero-hamper-desktop-v3.jpg",
    price: 2999,
    originalPrice: 5499,
    badge: "Bespoke Gifting",
    rating: 5.0,
    reviewCount: 142,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Hardboard Velvet Box & Jewelry",
    features: ["Gold Watch + Necklace", "Ferrero Rocher Box", "Fairy Lights & Card"],
    description:
      "Tailor-made for birthdays, anniversaries, and brides. Includes a gold watch, solitaire pendant necklace, golden chocolates, fairy lights & customized love letter.",
  },
];

export function getCollectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTIONS_DATA[slug];
}

export function getProductsByCollection(slug: string): CatalogProduct[] {
  return MVP_PRODUCTS.filter((p) => p.collectionSlug === slug);
}
