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
    name: "Aura Layered Bar Necklace",
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
    name: "Celeste Evil Eye Pendant",
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
    name: "Luxe Herringbone Snake Chain",
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
  {
    id: "solaire-clover-station-necklace",
    slug: "solaire-clover-station-necklace",
    name: "Solaire Clover Station Choker",
    collectionSlug: "necklaces",
    subcategory: "Chokers",
    primaryImage: "/images/products/aura-triple-bar-model.jpg",
    hoverImage: "/images/products/aura-triple-bar-studio.jpg",
    price: 1149,
    originalPrice: 2299,
    badge: "New Arrival",
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel & Mother of Pearl",
    features: ["18K Gold PVD", "Adjustable Extender", "Waterproof"],
    description:
      "Delicate floral clover stations spaced evenly along a fine 18K gold-plated chain. Sits gracefully at the collarbone for effortless everyday elegance.",
  },

  // 2. Earrings (4 products)
  {
    id: "luxe-solitaire-hoops",
    slug: "luxe-solitaire-hoops",
    name: "Luxe Solitaire & Hoop Duo",
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
    name: "Celeste Baroque Pearl Drops",
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
    name: "Aurora Croissant Dome Hoops",
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
  {
    id: "stella-pavé-huggie-earrings",
    slug: "stella-pave-huggie-earrings",
    name: "Stella Crystal Huggie Hoops",
    collectionSlug: "earrings",
    subcategory: "Huggie",
    primaryImage: "/images/products/luxe-solitaire-hoops-model.jpg",
    hoverImage: "/images/products/luxe-solitaire-hoops-studio.jpg",
    price: 799,
    originalPrice: 1599,
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 84,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel & Cubic Zirconia",
    features: ["Snug Huggie Fit", "Sleep-Friendly Clasp", "Waterproof"],
    description:
      "Micro-paved crystal huggie hoops designed for first and second piercings. Comfortable enough to sleep and shower in.",
  },

  // 3. Bracelets (4 products)
  {
    id: "eternal-paperclip-cuff",
    slug: "eternal-paperclip-cuff",
    name: "Eternal Chain & Cuff Duo",
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
  {
    id: "empress-roman-crystal-bangle",
    slug: "empress-roman-crystal-bangle",
    name: "Empress Roman Love Bangle",
    collectionSlug: "bracelets",
    subcategory: "Cuffs",
    primaryImage: "/images/products/eternal-paperclip-cuff-model.jpg",
    hoverImage: "/images/categories/cat-bracelets.jpg",
    price: 1249,
    originalPrice: 2499,
    badge: "Trending",
    rating: 4.9,
    reviewCount: 73,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel",
    features: ["Hidden Hinge Clasp", "Oval Wrist Fit", "Scratch-Resistant"],
    description:
      "Sculpted oval bangle accented with engraved Roman numerals and flush-set solitaire crystals.",
  },
  {
    id: "clover-charm-link-bracelet",
    slug: "clover-charm-link-bracelet",
    name: "Lucky Clover Link Bracelet",
    collectionSlug: "bracelets",
    subcategory: "Link Chains",
    primaryImage: "/images/products/celeste-evil-eye-studio.jpg",
    hoverImage: "/images/categories/cat-bracelets.jpg",
    price: 999,
    originalPrice: 1999,
    badge: "Waterproof",
    rating: 4.8,
    reviewCount: 54,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Mother of Pearl & Stainless Steel",
    features: ["Double-Sided Motifs", "Lobster Clasp", "100% Tarnish-Free"],
    description:
      "Dainty four-leaf clover motifs in iridescent mother of pearl framed by beaded 18K gold borders.",
  },

  // 4. Rings (4 products)
  {
    id: "starlight-stacking-trio",
    slug: "starlight-stacking-trio",
    name: "Starlight Stacking Ring Trio",
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
    name: "Verde Emerald Solitaire Ring",
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
  {
    id: "soleil-chunky-dome-ring",
    slug: "soleil-chunky-dome-ring",
    name: "Soleil Golden Signet Dome Ring",
    collectionSlug: "rings",
    subcategory: "Bands",
    primaryImage: "/images/products/starlight-rings-model.jpg",
    hoverImage: "/images/products/starlight-rings-studio.jpg",
    price: 799,
    originalPrice: 1599,
    badge: "Trending",
    rating: 4.8,
    reviewCount: 62,
    inStock: true,
    plating: "18K Gold Plated",
    material: "316L Stainless Steel",
    features: ["Mirror Gold Polish", "Tapered Band", "Waterproof"],
    description:
      "Bold yet featherlight high-shine dome ring that makes an instant statement on index or middle fingers.",
  },
  {
    id: "eternity-crystal-band-ring",
    slug: "eternity-crystal-band-ring",
    name: "Celeste Diamond Eternity Band",
    collectionSlug: "rings",
    subcategory: "Bands",
    primaryImage: "/images/products/starlight-rings-studio.jpg",
    hoverImage: "/images/categories/cat-rings.jpg",
    price: 899,
    originalPrice: 1799,
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 79,
    inStock: true,
    plating: "18K Gold Plated",
    material: "AAA Cubic Zirconia & Steel",
    features: ["360° Pavé Stones", "Stack-Ready", "Zero Tarnish"],
    description:
      "Full-circle micro-pavé cubic zirconia eternity band crafted to shine alongside solitaires or worn solo.",
  },

  // 5. Watches (2 products)
  {
    id: "royale-jubilee-watch",
    slug: "royale-jubilee-watch",
    name: "Royale Jubilee Gold Watch",
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
    name: "Petite Emerald Mesh Watch",
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
    name: "Noor Kundan & Pearl Choker",
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

  // 7. Gifting Studio (2 products)
  {
    id: "queens-keepsake-hamper",
    slug: "queens-keepsake-hamper",
    name: "Queen's Keepsake Gift Box",
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
  {
    id: "blush-rose-jewelry-bouquet",
    slug: "blush-rose-jewelry-bouquet",
    name: "Blush Rose Jewelry Bouquet",
    collectionSlug: "bouquets",
    subcategory: "Blush Rose",
    primaryImage: "/images/categories/cat-bouquets.jpg",
    hoverImage: "/images/hero/hero-hamper-mobile-v3.jpg",
    price: 2299,
    originalPrice: 4299,
    badge: "Signature Bouquet",
    rating: 4.9,
    reviewCount: 108,
    inStock: true,
    plating: "18K Gold Plated",
    material: "Everlasting Silk Blooms & 316L Steel Jewelry",
    features: ["Everlasting Silk Blooms", "18K Gold Necklace + Hoops", "Luxury Satin Wrap"],
    description:
      "Shiqueen's viral gifting innovation: romantic blush and dusty rose everlasting blooms nestled with an 18K gold pendant necklace and hoop earrings.",
  },
];

const SLUG_ALIASES: Record<string, string> = {
  "aura-triple-necklace": "aura-triple-bar-necklace",
  "eternal-chain-cuff": "eternal-paperclip-cuff",
  "starlight-stacking-rings": "starlight-stacking-trio",
};

export function getCollectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTIONS_DATA[slug];
}

export function getProductsByCollection(slug: string): CatalogProduct[] {
  return MVP_PRODUCTS.filter((p) => p.collectionSlug === slug);
}

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  const normalized = SLUG_ALIASES[slug] ?? slug;
  return MVP_PRODUCTS.find((p) => p.slug === normalized || p.id === normalized);
}

export function getRelatedProducts(
  product: CatalogProduct,
  limit = 4
): CatalogProduct[] {
  const sameCollection = MVP_PRODUCTS.filter(
    (p) => p.collectionSlug === product.collectionSlug && p.slug !== product.slug
  );
  const others = MVP_PRODUCTS.filter(
    (p) => p.collectionSlug !== product.collectionSlug && p.slug !== product.slug
  );
  return [...sameCollection, ...others].slice(0, limit);
}

export interface ProductSpecItem {
  label: string;
  value: string;
}

export function getProductSpecifications(product: CatalogProduct): ProductSpecItem[] {
  const sizeByCollection: Record<string, string> = {
    necklaces: "40 cm + 5 cm Adjustable Extender Chain",
    earrings: "22 mm Comfort Hoop / Stud Fit (Featherlight)",
    bracelets: "16.5 cm + 3.5 cm Extension (Fits All Wrists)",
    rings: "US 6, 7, 8 & Adjustable Comfort Fit Available",
    watches: "28 mm Dial • Adjustable Link / Milanese Strap",
    festive: "Adjustable Dori Tassel & Push-Back Jhumkas",
    hampers: "26 × 22 × 10 cm Luxury Magnetic Keepsake Box",
    bouquets: "38 × 26 cm Hand-Wrapped Satin Floral Bouquet",
  };

  const closureByCollection: Record<string, string> = {
    necklaces: "Reinforced Lobster Clasp",
    earrings: "Hypoallergenic Click-Top / Push Back",
    bracelets: "Double-Lock Foldover / Lobster Clasp",
    rings: "Smooth Interior Comfort Band",
    watches: "Stainless Steel Jewellery Folding Clasp",
    festive: "Traditional Silk Thread Dori Lock",
    hampers: "Gold Ribbon & Magnetic Box Seal",
    bouquets: "Satin Bow & Protective Acrylic Carry Bag",
  };

  return [
    { label: "Color / Finish", value: product.plating },
    { label: "Plating Technology", value: `${product.plating} (Vacuum PVD Coating)` },
    { label: "Base Material", value: product.material },
    {
      label: "Size & Fit",
      value: sizeByCollection[product.collectionSlug] ?? "Standard Adjustable Fit",
    },
    {
      label: "Clasp / Closure",
      value: closureByCollection[product.collectionSlug] ?? "Secure Luxury Closure",
    },
    {
      label: "Durability & Spec",
      value: "100% Anti-Tarnish, Waterproof, Sweatproof & Skin-Safe",
    },
  ];
}

export interface ProductReview {
  id: string;
  author: string;
  initials: string;
  location: string;
  date: string;
  rating: number;
  verified: boolean;
  title: string;
  body: string;
  images?: string[];
  helpfulCount: number;
  variantPurchased: string;
}

export function getProductReviews(product: CatalogProduct): ProductReview[] {
  return [
    {
      id: `${product.slug}-rev-1`,
      author: "Smita Sharma",
      initials: "SS",
      location: "Mumbai",
      date: "12 Oct 2026",
      rating: 5,
      verified: true,
      title: "Looks exactly like real 18K gold!",
      body: `Bought the ${product.name} two months ago and I wear it almost every single day—even in the shower and to the office. The finish hasn't faded a bit and it looks super dainty and classy!`,
      images: [product.hoverImage, product.primaryImage],
      helpfulCount: 19,
      variantPurchased: product.plating,
    },
    {
      id: `${product.slug}-rev-2`,
      author: "Ananya Verma",
      initials: "AV",
      location: "Delhi NCR",
      date: "28 Sep 2026",
      rating: 5,
      verified: true,
      title: "Zero tarnish & gorgeous packaging",
      body: `I have super sensitive skin and most artificial jewelry gives me rashes, but Shiqueen's ${product.material.toLowerCase()} piece feels featherlight and completely irritation-free. Also loved the cute keepsake box!`,
      images: [product.primaryImage],
      helpfulCount: 14,
      variantPurchased: product.plating,
    },
    {
      id: `${product.slug}-rev-3`,
      author: "Riya Patel",
      initials: "RP",
      location: "Ahmedabad",
      date: "15 Sep 2026",
      rating: 5,
      verified: true,
      title: "Best gifting decision ever",
      body: `Ordered this with the ₹50 special gift wrap for my sister's birthday. Their WhatsApp support team helped me add a handwritten note and delivered it in just 2 days. She was obsessed!`,
      images: [product.hoverImage],
      helpfulCount: 11,
      variantPurchased: `${product.plating} + Gift Wrap`,
    },
    {
      id: `${product.slug}-rev-4`,
      author: "Meera Nair",
      initials: "MN",
      location: "Bengaluru",
      date: "03 Sep 2026",
      rating: 4,
      verified: true,
      title: "Very elegant & premium shine",
      body: `The quality of the clasp and detailing on ${product.name} is way better than other brands at this price point. Bought 2 pieces under the B1G1 offer and both are stunning.`,
      helpfulCount: 7,
      variantPurchased: product.plating,
    },
    {
      id: `${product.slug}-rev-5`,
      author: "Pooja Malhotra",
      initials: "PM",
      location: "Chandigarh",
      date: "21 Aug 2026",
      rating: 5,
      verified: true,
      title: "Repeat customer — my 4th order from Shiqueen!",
      body: `Every time I wear this out, people ask me which jeweler I got it from. Totally waterproof and worth every rupee.`,
      helpfulCount: 9,
      variantPurchased: product.plating,
    },
  ];
}
