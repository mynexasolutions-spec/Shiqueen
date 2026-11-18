export const BRAND = {
  name: "SHIQUEEN",
  tagline: "Crafted For Every Queen",
  logoPath: "/images/shiqueen-logo.jpg",
  description:
    "Anti-Tarnish & Artificial Jewelry Retail, Customized Gift Hampers & Jewelry Bouquets with Pan-India Shipping & WhatsApp Order Support.",
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/shiqueen.in?cplk=MWliN3p5NTg3NHBmMQ==",
  instagramHandle: "@shiqueen.in",
  facebook: "https://www.facebook.com/share/1EBbNkZrMp/",
  whatsappUrl: (text: string) =>
    `https://wa.me/?text=${encodeURIComponent(text)}`,
} as const;

export interface CoreService {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: "sparkles" | "gift" | "truck";
}

export const CORE_SERVICES: CoreService[] = [
  {
    id: "anti-tarnish-retail",
    title: "Anti-Tarnish & Artificial Jewelry Retail",
    description:
      "18K gold-toned waterproof Necklaces, Earrings, Bracelets, Rings, Anti-Tarnish Watches & Festive Sets.",
    badge: "Waterproof & Sweatproof",
    icon: "sparkles",
  },
  {
    id: "hampers-bouquets",
    title: "Customized Gift Hampers & Jewelry Bouquets",
    description:
      "Handcrafted floral jewelry bouquets & curated luxury keepsake gift boxes customized for every occasion.",
    badge: "Bespoke Gifting Studio",
    icon: "gift",
  },
  {
    id: "pan-india-whatsapp",
    title: "Pan-India Shipping & WhatsApp Order Support",
    description:
      "Safe nationwide delivery across India with personalized 1-on-1 order & customization support on WhatsApp.",
    badge: "1-on-1 Concierge Support",
    icon: "truck",
  },
];

export interface ProductCategory {
  id: string;
  name: string;
  shortName: string;
  href: string;
  subcategories?: string[];
  description: string;
  badge: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "anti-tarnish-jewelry",
    name: "Anti-Tarnish Jewelry",
    shortName: "Anti-Tarnish Jewelry",
    href: "#categories",
    subcategories: [
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Rings",
      "Anti-Tarnish Watch",
    ],
    description:
      "Everyday demi-fine waterproof pieces in Necklaces, Earrings, Bracelets, Rings & Anti-Tarnish Watches.",
    badge: "5 Subcategories",
  },
  {
    id: "festive-ethnic-sets",
    name: "Jewelry Sets & Festive / Ethnic Sets",
    shortName: "Festive & Ethnic Sets",
    href: "#categories",
    description:
      "Statement chokers, layered sets, and festive-ready ethnic designs crafted to shine through every celebration.",
    badge: "Festive Edit",
  },
  {
    id: "customized-gift-hampers",
    name: "Customized Gift Hampers",
    shortName: "Custom Gift Hampers",
    href: "#gifting-studio",
    description:
      "Keepsake gift boxes curated with anti-tarnish jewelry, watches, chocolates, fairy lights & personalized notes.",
    badge: "Made to Order",
  },
  {
    id: "jewelry-gift-bouquets",
    name: "Jewelry & Gift Bouquets",
    shortName: "Jewelry Bouquets",
    href: "#gifting-studio",
    description:
      "Signature pastel & gold-wrapped floral bouquets nestled with tarnish-free necklaces, earrings & rings.",
    badge: "Signature Gift",
  },
];

export interface AnnouncementItem {
  id: string;
  icon: "sparkles" | "gift" | "truck" | "watch";
  text: string;
}

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "anti-tarnish",
    icon: "sparkles",
    text: "100% Anti-Tarnish & Waterproof Jewelry — Everyday Luxury Crafted For Every Queen",
  },
  {
    id: "hampers-bouquets",
    icon: "gift",
    text: "Customized Gift Hampers & Jewelry Bouquets — Tailor-Made for Birthdays, Anniversaries & Bridesmaids",
  },
  {
    id: "pan-india-shipping",
    icon: "truck",
    text: "Pan-India Shipping Available • Instant 1-on-1 WhatsApp Order & Customization Support",
  },
  {
    id: "collections",
    icon: "watch",
    text: "Explore Necklaces, Earrings, Bracelets, Rings, Anti-Tarnish Watches & Festive / Ethnic Sets",
  },
];

export interface HeroSlide {
  id: string;
  tabLabel: string;
  mobileTabLabel: string;
  desktopImage: string;
  mobileImage: string;
  imageAlt: string;
  bgColor: string;
  eyebrow: string;
  title: string;
  highlightWord: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    whatsappText: string;
  };
  pills: string[];
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "anti-tarnish-jewelry",
    tabLabel: "01. Anti-Tarnish Jewelry & Watches",
    mobileTabLabel: "Jewelry & Watch",
    desktopImage: "/images/hero/hero-jewelry-desktop-v3.jpg",
    mobileImage: "/images/hero/hero-jewelry-mobile-v3.jpg",
    imageAlt:
      "Indian model wearing Shiqueen 18K gold-toned layered anti-tarnish necklaces, hoop earrings, bracelets, and gold wristwatch",
    bgColor: "#DDB091",
    eyebrow: "100% ANTI-TARNISH • WATERPROOF • SKIN-FRIENDLY",
    title: "Everyday Luxury, Crafted For Every Queen",
    highlightWord: "Every Queen",
    description:
      "Elevate your daily & festive look with 18K gold-toned Necklaces, Earrings, Bracelets, Rings & Anti-Tarnish Watches that never lose their shine.",
    primaryCta: {
      label: "Explore Jewelry Collection",
      href: "#categories",
    },
    secondaryCta: {
      label: "Order on WhatsApp",
      whatsappText:
        "Hi Shiqueen! I would like to explore your Anti-Tarnish Jewelry & Watches collection.",
    },
    pills: [
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Rings",
      "Anti-Tarnish Watch",
    ],
  },
  {
    id: "festive-ethnic-sets",
    tabLabel: "02. Festive & Ethnic Sets",
    mobileTabLabel: "Festive Sets",
    desktopImage: "/images/hero/hero-festive-desktop.jpg",
    mobileImage: "/images/hero/hero-festive-mobile.jpg",
    imageAlt:
      "Indian model in regal ivory gold attire wearing Shiqueen statement Kundan pearl choker necklace, maangtikka, and matching jhumkas",
    bgColor: "#DFA989",
    eyebrow: "FESTIVE & ETHNIC EDITIONS • TIMELESS HERITAGE",
    title: "Royal Festive Sets, Crafted For Every Celebration",
    highlightWord: "Every Celebration",
    description:
      "Shine through weddings, celebrations & festive milestones with heirloom-inspired Kundan & pearl chokers, jhumkas, and ethnic jewelry sets.",
    primaryCta: {
      label: "Explore Festive Sets",
      href: "#categories",
    },
    secondaryCta: {
      label: "Order on WhatsApp",
      whatsappText:
        "Hi Shiqueen! I would like to explore your Festive & Ethnic Sets collection.",
    },
    pills: [
      "Festive Sets",
      "Ethnic Chokers",
      "Maangtikka",
      "Jhumkas",
    ],
  },
  {
    id: "hampers-and-bouquets",
    tabLabel: "03. Custom Hampers & Bouquets",
    mobileTabLabel: "Hampers & Bouquets",
    desktopImage: "/images/hero/hero-hamper-desktop-v3.jpg",
    mobileImage: "/images/hero/hero-hamper-mobile-v3.jpg",
    imageAlt:
      "Shiqueen handcrafted Jewelry Bouquet with pastel roses and gold necklaces next to a luxury Customized Gift Hamper box with gold watch and chocolates",
    bgColor: "#F0BFA6",
    eyebrow: "SIGNATURE GIFTING STUDIO • CUSTOMIZED WITH LOVE",
    title: "Bespoke Jewelry Bouquets & Luxury Gift Hampers",
    highlightWord: "Luxury Gift Hampers",
    description:
      "Unforgettable handcrafted Jewelry Bouquets and Customized Gift Hampers packed with anti-tarnish jewelry, watches, chocolates, fairy lights & heartfelt notes.",
    primaryCta: {
      label: "Explore Hampers & Bouquets",
      href: "#gifting-studio",
    },
    secondaryCta: {
      label: "Customize on WhatsApp",
      whatsappText:
        "Hi Shiqueen! I want to customize a Gift Hamper / Jewelry Bouquet.",
    },
    pills: [
      "Customized Gift Hampers",
      "Jewelry & Gift Bouquets",
      "Bespoke Gifting",
    ],
  },
];

export interface VisualCategory {
  id: string;
  name: string;
  tagline: string;
  image: string;
  filterKey: string;
  badge?: string;
}

export const VISUAL_CATEGORIES: VisualCategory[] = [
  {
    id: "necklaces",
    name: "Necklaces",
    tagline: "Layered & Pendants",
    image: "/images/categories/cat-necklaces.jpg",
    filterKey: "jewelry",
    badge: "Anti-Tarnish",
  },
  {
    id: "earrings",
    name: "Earrings",
    tagline: "Hoops & Solitaires",
    image: "/images/categories/cat-earrings.jpg",
    filterKey: "jewelry",
    badge: "Waterproof",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    tagline: "Link Chains & Cuffs",
    image: "/images/categories/cat-bracelets.jpg",
    filterKey: "jewelry",
  },
  {
    id: "rings",
    name: "Rings",
    tagline: "Stacking Bands",
    image: "/images/categories/cat-rings.jpg",
    filterKey: "jewelry",
  },
  {
    id: "watches",
    name: "Anti-Tarnish Watches",
    tagline: "18K Jubilee Links",
    image: "/images/categories/cat-watches.jpg",
    filterKey: "watches",
    badge: "Signature",
  },
  {
    id: "festive",
    name: "Festive & Ethnic Sets",
    tagline: "Kundan & Pearl Chokers",
    image: "/images/categories/cat-festive.jpg",
    filterKey: "festive",
    badge: "Royal Edit",
  },
  {
    id: "hampers",
    name: "Custom Gift Hampers",
    tagline: "Luxury Keepsake Boxes",
    image: "/images/categories/cat-hampers.jpg",
    filterKey: "gifting",
    badge: "Bespoke",
  },
  {
    id: "bouquets",
    name: "Jewelry Bouquets",
    tagline: "Handcrafted Blooms",
    image: "/images/categories/cat-bouquets.jpg",
    filterKey: "gifting",
    badge: "Trending",
  },
];

export interface ProductItem {
  id: string;
  name: string;
  category: "jewelry" | "watches" | "festive" | "gifting";
  categoryLabel: string;
  image: string;
  price: number;
  originalPrice: number;
  badge: string;
  features: string[];
  description: string;
}

export const FEATURED_PRODUCTS: ProductItem[] = [
  {
    id: "aura-triple-necklace",
    name: "Aura Layered Bar Necklace",
    category: "jewelry",
    categoryLabel: "Anti-Tarnish Jewelry",
    image: "/images/products/aura-triple-bar-studio.jpg",
    price: 1299,
    originalPrice: 2499,
    badge: "Bestseller",
    features: ["18K Gold Plated", "Waterproof & Sweatproof", "Hypoallergenic"],
    description:
      "A stunning triple-layered design featuring a sleek vertical bar pendant and sparkling solitaire crystal. 100% anti-tarnish stainless steel crafted for daily wear.",
  },
  {
    id: "luxe-solitaire-hoops",
    name: "Luxe Solitaire & Hoop Duo",
    category: "jewelry",
    categoryLabel: "Anti-Tarnish Jewelry",
    image: "/images/products/luxe-solitaire-hoops-studio.jpg",
    price: 899,
    originalPrice: 1699,
    badge: "Waterproof",
    features: ["18K Gold PVD Coating", "AAA Micro-Zircons", "Zero Skin Green"],
    description:
      "Timeless everyday duo with comfortable click-closure gold hoops and brilliant faceted solitaire studs. Wear them swimming, showering, or partying without color fade.",
  },
  {
    id: "eternal-chain-cuff",
    name: "Eternal Chain & Cuff Duo",
    category: "jewelry",
    categoryLabel: "Anti-Tarnish Jewelry",
    image: "/images/categories/cat-bracelets.jpg",
    price: 1199,
    originalPrice: 2199,
    badge: "Trending",
    features: ["Heavy 18K Gold Finish", "Adjustable Fit", "Anti-Scratch Polish"],
    description:
      "Modern paperclip link chain bracelet paired with a sleek minimalist ball-end cuff. Looks effortlessly chic stacked with watches or worn solo.",
  },
  {
    id: "starlight-stacking-rings",
    name: "Starlight Stacking Ring Trio",
    category: "jewelry",
    categoryLabel: "Anti-Tarnish Jewelry",
    image: "/images/products/starlight-rings-studio.jpg",
    price: 999,
    originalPrice: 1899,
    badge: "Tarnish-Proof",
    features: ["Pavé Leaf Band", "Bezel Solitaire", "Eternity Crystal Ring"],
    description:
      "Three complementary stacking bands including a leafy laurel motif, solitaire bezel, and eternity band. Stack all three or style across different fingers.",
  },
  {
    id: "royale-jubilee-watch",
    name: "Royale Jubilee Gold Watch",
    category: "watches",
    categoryLabel: "Anti-Tarnish Watches",
    image: "/images/products/petite-emerald-watch-studio.jpg",
    price: 1999,
    originalPrice: 3999,
    badge: "Signature Luxe",
    features: ["Gold Jubilee Bracelet", "Pure White Minimal Dial", "Water-Resistant"],
    description:
      "Shiqueen's signature demi-fine ladies wristwatch with fluted bezel, clean index markers, and premium stainless steel link bracelet with gold PVD coating.",
  },
  {
    id: "noor-kundan-choker-set",
    name: "Noor Kundan & Pearl Choker",
    category: "festive",
    categoryLabel: "Festive & Ethnic Sets",
    image: "/images/products/noor-kundan-choker-studio.jpg",
    price: 2499,
    originalPrice: 4999,
    badge: "Royal Festive Edit",
    features: ["Heavy Kundan Choker", "Matching Jhumkas", "Bridal Maangtikka"],
    description:
      "An exquisite heirloom-quality statement set with handcrafted Kundan stones, natural faux pearls, and antique gold plating for weddings and festive grandeur.",
  },
  {
    id: "queens-keepsake-hamper",
    name: "Queen's Keepsake Gift Box",
    category: "gifting",
    categoryLabel: "Customized Gift Hampers",
    image: "/images/categories/cat-hampers.jpg",
    price: 2999,
    originalPrice: 5499,
    badge: "Bespoke Gifting",
    features: ["Gold Watch + Necklace", "Ferrero Rocher Box", "Fairy Lights & Card"],
    description:
      "Tailor-made for birthdays, anniversaries, and brides. Includes a gold watch, solitaire pendant necklace, golden chocolates, fairy lights & customized love letter.",
  },
  {
    id: "blush-rose-jewelry-bouquet",
    name: "Blush Rose Jewelry Bouquet",
    category: "gifting",
    categoryLabel: "Jewelry Bouquets",
    image: "/images/categories/cat-bouquets.jpg",
    price: 2299,
    originalPrice: 4299,
    badge: "Signature Bouquet",
    features: ["Everlasting Silk Blooms", "18K Gold Necklace + Hoops", "Luxury Satin Wrap"],
    description:
      "Shiqueen's viral gifting innovation: romantic blush and dusty rose everlasting blooms nestled with an 18K gold pendant necklace and hoop earrings.",
  },
];

export const MARQUEE_ITEMS: string[] = [
  "100% ANTI-TARNISH & WATERPROOF",
  "NECKLACES, EARRINGS, BRACELETS, RINGS & ANTI-TARNISH WATCH",
  "JEWELRY SETS & FESTIVE / ETHNIC SETS",
  "CUSTOMIZED GIFT HAMPERS",
  "JEWELRY & GIFT BOUQUETS",
  "PAN-INDIA SHIPPING & WHATSAPP ORDER SUPPORT",
];
