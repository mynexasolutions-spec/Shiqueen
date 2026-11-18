"use client";

import Image from "next/image";
import { useState } from "react";
import { SOCIAL_LINKS } from "@/lib/brand-data";
import { WhatsAppIcon } from "@/components/Header";

interface GiftType {
  id: string;
  label: string;
  subtitle: string;
  badge?: string;
  startingPrice: string;
  basePrice: number;
  image: string;
  features: string[];
}

interface Occasion {
  id: string;
  label: string;
  subtitle: string;
  themeNote: string;
  iconTag: string;
}

export interface AddonOption {
  id: string;
  label: string;
  desc: string;
  defaultChecked: boolean;
  estPrice: number;
}

const GIFT_TYPES: readonly GiftType[] = [
  {
    id: "hamper",
    label: "Luxury Gift Hamper",
    subtitle: "Rigid keepsake velvet box with warm starlight glow & gourmet golden chocolates",
    badge: "Most Popular",
    startingPrice: "Starts ₹1,499",
    basePrice: 1499,
    image: "/images/categories/cat-hampers.jpg",
    features: [
      "Rigid velvet-lined keepsake gift box",
      "18K Gold anti-tarnish watch or jewelry",
      "Ferrero Rocher & warm fairy lights",
    ],
  },
  {
    id: "bouquet",
    label: "Signature Jewelry Bouquet",
    subtitle: "Everlasting floral wrap with waterproof gold necklace & satin ribbons",
    badge: "Viral Trend",
    startingPrice: "Starts ₹1,199",
    basePrice: 1199,
    image: "/images/categories/cat-bouquets.jpg",
    features: [
      "Everlasting preserved silk blooms",
      "18K Gold-toned anti-tarnish pendant set",
      "Pastel frosted wrap & golden satin bow",
    ],
  },
  {
    id: "combo",
    label: "Grand Gifting Combo",
    subtitle: "The ultimate celebration: luxury keepsake box paired with floral bouquet",
    badge: "Ultimate Luxury",
    startingPrice: "Starts ₹2,599",
    basePrice: 2599,
    image: "/images/categories/cat-festive.jpg",
    features: [
      "Full luxury gift hamper + mini bouquet",
      "Complete 18K demi-fine watch & jewelry set",
      "Handwritten wax-sealed letter & lights",
    ],
  },
] as const;

const OCCASIONS: readonly Occasion[] = [
  {
    id: "birthday",
    label: "Birthday Special",
    subtitle: "Celebrate with golden sparkle, birthday wish card & celebratory unboxing glow",
    themeNote: "Birthday wish card & warm celebratory glow",
    iconTag: "Birthday Special",
  },
  {
    id: "anniversary",
    label: "Anniversary / Romance",
    subtitle: "Heartfelt luxury, wax-sealed love letter & timeless keepsake demi-fine jewelry",
    themeNote: "Wax-sealed love letter & keepsake jewelry",
    iconTag: "Romantic Romance",
  },
  {
    id: "bridesmaid",
    label: "Bridesmaid & Wedding",
    subtitle: "For bride squad proposals, bridal pampering & unforgettable wedding party favors",
    themeNote: "Will you be my bridesmaid? proposal theme",
    iconTag: "Bridal Party",
  },
  {
    id: "queen",
    label: "Self-Care & Queen Gift",
    subtitle: "Empowering self-love unboxing curated to crown yourself with 18K luxury pieces",
    themeNote: "Crown yourself with 18K anti-tarnish pieces",
    iconTag: "Self-Love Curation",
  },
] as const;

// Dynamic Add-ons Matrix tailored to Creation & Occasion
function getAddons(typeId: string, occasionId: string): AddonOption[] {
  if (typeId === "hamper") {
    if (occasionId === "bridesmaid") {
      return [
        {
          id: "watch",
          label: "18K Gold Jubilee Watch",
          desc: "Waterproof demi-fine luxury timepiece",
          defaultChecked: true,
          estPrice: 499,
        },
        {
          id: "bridesmaid_card",
          label: '"Will You Be My Bridesmaid?" Card',
          desc: "Gold foil calligraphy invitation note",
          defaultChecked: true,
          estPrice: 0,
        },
        {
          id: "scrunchie",
          label: "Champagne Satin Silk Scrunchie",
          desc: "Handcrafted bridal accessory keepsake",
          defaultChecked: true,
          estPrice: 149,
        },
        {
          id: "chocolates",
          label: "Ferrero Rocher Golden 4-Pack",
          desc: "Sweet celebratory golden treats",
          defaultChecked: true,
          estPrice: 199,
        },
        {
          id: "candle",
          label: "French Vanilla Soy Wax Candle",
          desc: "Aromatic relaxing glow in glass jar",
          defaultChecked: false,
          estPrice: 249,
        },
        {
          id: "engraving",
          label: "Custom Name Foil on Box Lid",
          desc: "Personalized metallic name embossing",
          defaultChecked: false,
          estPrice: 199,
        },
      ];
    }

    return [
      {
        id: "watch",
        label: "18K Gold Jubilee Watch",
        desc: "Waterproof demi-fine luxury timepiece",
        defaultChecked: true,
        estPrice: 499,
      },
      {
        id: "chocolates",
        label: "Ferrero Rocher Golden Treats",
        desc: "4-pc crisp hazelnut chocolates",
        defaultChecked: true,
        estPrice: 199,
      },
      {
        id: "lights",
        label: "Warm Starlight Fairy Lights",
        desc: "Magical warm unboxing glow",
        defaultChecked: true,
        estPrice: 99,
      },
      {
        id: "letter",
        label: "Wax-Sealed Handwritten Letter",
        desc: "Custom calligraphy heartfelt note",
        defaultChecked: true,
        estPrice: 0,
      },
      {
        id: "candle",
        label: "French Vanilla Soy Candle",
        desc: "Hand-poured aromatherapeutic candle",
        defaultChecked: false,
        estPrice: 249,
      },
      {
        id: "engraving",
        label: "Custom Gold Foil Name on Lid",
        desc: "Personalized recipient name on box",
        defaultChecked: false,
        estPrice: 199,
      },
    ];
  }

  if (typeId === "bouquet") {
    if (occasionId === "bridesmaid") {
      return [
        {
          id: "jewelry",
          label: "18K Demi-Fine Pendant & Studs",
          desc: "Waterproof anti-tarnish jewelry set",
          defaultChecked: true,
          estPrice: 399,
        },
        {
          id: "blooms",
          label: "Everlasting Preserved Silk Blooms",
          desc: "Never wilts, stays fresh forever",
          defaultChecked: true,
          estPrice: 0,
        },
        {
          id: "squad_tag",
          label: '"Bride Squad" Satin Ribbon Tag',
          desc: "Custom frosted wrapping & bow",
          defaultChecked: true,
          estPrice: 99,
        },
        {
          id: "spritz",
          label: "Scented Rose Bloom Mist Spritz",
          desc: "Subtle fresh botanical aroma",
          defaultChecked: true,
          estPrice: 99,
        },
        {
          id: "transit",
          label: "Anti-Damage Safe Transit Shell",
          desc: "Protective shell for safe shipping",
          defaultChecked: true,
          estPrice: 0,
        },
        {
          id: "scrunchie",
          label: "Champagne Satin Silk Scrunchie",
          desc: "Tucked elegantly among blooms",
          defaultChecked: false,
          estPrice: 149,
        },
      ];
    }

    return [
      {
        id: "jewelry",
        label: "18K Demi-Fine Pendant & Studs",
        desc: "Waterproof anti-tarnish jewelry pieces",
        defaultChecked: true,
        estPrice: 399,
      },
      {
        id: "blooms",
        label: "Everlasting Preserved Silk Blooms",
        desc: "Handcrafted blooms that never wilt",
        defaultChecked: true,
        estPrice: 0,
      },
      {
        id: "wrapping",
        label: "Pastel Frosted Wrap & Satin Bow",
        desc: "Layered aesthetic luxury packaging",
        defaultChecked: true,
        estPrice: 0,
      },
      {
        id: "spritz",
        label: "Scented Rose Bloom Mist Spritz",
        desc: "Subtle fresh botanical aroma",
        defaultChecked: true,
        estPrice: 99,
      },
      {
        id: "letter",
        label: "Mini Keepsake Envelope Note",
        desc: "Handwritten heartfelt message card",
        defaultChecked: true,
        estPrice: 0,
      },
      {
        id: "chocolates_skewer",
        label: "Ferrero Rocher Floral Inserts",
        desc: "Chocolates nestled among petals",
        defaultChecked: false,
        estPrice: 199,
      },
    ];
  }

  // Grand Gifting Combo
  return [
    {
      id: "watch_set",
      label: "18K Gold Jubilee Watch + Jewelry Set",
      desc: "Complete waterproof demi-fine collection",
      defaultChecked: true,
      estPrice: 799,
    },
    {
      id: "mini_bouquet",
      label: "Handcrafted Mini Preserved Bouquet",
      desc: "Everlasting blooms paired with box",
      defaultChecked: true,
      estPrice: 399,
    },
    {
      id: "chocolates",
      label: "Ferrero Rocher Golden Collection",
      desc: "Sweet celebratory golden indulgence",
      defaultChecked: true,
      estPrice: 199,
    },
    {
      id: "lights",
      label: "Warm Starlight Fairy Lights",
      desc: "Magical warm glow across box & bouquet",
      defaultChecked: true,
      estPrice: 99,
    },
    {
      id: "letter",
      label: "Wax-Sealed Calligraphy Love Letter",
      desc: "Personalized custom handwritten message",
      defaultChecked: true,
      estPrice: 0,
    },
    {
      id: "candle",
      label: "French Vanilla Soy Wax Candle",
      desc: "Aromatic relaxation candle in glass jar",
      defaultChecked: false,
      estPrice: 249,
    },
  ];
}

function WatchSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v3l2 1" />
      <path d="M9 6V2h6v4M9 18v4h6v-4" />
    </svg>
  );
}

function ChocolateSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 13h18" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function SparkleAuraSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M12 3l2 5.5L19.5 10.5l-5.5 2L12 18l-2-5.5-5.5-2 5.5-2L12 3z" />
      <path d="M19 3v4M21 5h-4" />
    </svg>
  );
}

function LoveLetterSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <rect width="20" height="15" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function DiamondSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M6 3h12l4 7-10 11L2 10l4-7z" />
      <path d="M10 3l-2 7 4 11 4-11-2-7" />
    </svg>
  );
}

function BotanicalRoseSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5c-.8 0-1.6-.2-2.3-.6l-2.2 4.6" />
      <path d="M12 16c-2 0-3.5-1.5-3.5-3.5 0-1.7 1.2-3.1 2.8-3.4" />
      <path d="M12 16v6M8 19l4-2 4 2" />
    </svg>
  );
}

function RibbonBowSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M9.5 10C8 8.5 6 8.5 4.5 10s-1 3.5 1 4.5l4 1" />
      <path d="M14.5 10c1.5-1.5 3.5-1.5 5 0s1 3.5-1 4.5l-4 1" />
      <path d="M10.5 14.5L7 21l3-1 2 2" />
      <path d="M13.5 14.5L17 21l-3-1-2 2" />
    </svg>
  );
}

function TransitBoxSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}

export default function GiftingStudio() {
  // Stepper state: 1 = Creation, 2 = Occasion, 3 = Finalize & Checkout
  const [activeStep, setActiveStep] = useState<number>(1);

  // By default UNSELECTED state:
  const [previewType, setPreviewType] = useState<string>("hamper");
  const [selectedType, setSelectedType] = useState<string>(""); // unselected by default
  const [selectedOccasion, setSelectedOccasion] = useState<string>(""); // unselected by default

  const effectiveType = selectedType || previewType;
  const effectiveOccasion = selectedOccasion || "birthday";

  // Dynamic addons
  const availableAddons = getAddons(effectiveType, effectiveOccasion);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(() =>
    getAddons("hamper", "birthday")
      .filter((a) => a.defaultChecked)
      .map((a) => a.id)
  );

  const handleCommitType = (typeId: string) => {
    setSelectedType(typeId);
    setPreviewType(typeId);
    const nextAddons = getAddons(typeId, effectiveOccasion);
    setSelectedAddons(nextAddons.filter((a) => a.defaultChecked).map((a) => a.id));
  };

  const handleCommitOccasion = (occasionId: string) => {
    setSelectedOccasion(occasionId);
    const nextAddons = getAddons(effectiveType, occasionId);
    setSelectedAddons(nextAddons.filter((a) => a.defaultChecked).map((a) => a.id));
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentPreviewObj = GIFT_TYPES.find((t) => t.id === previewType) ?? GIFT_TYPES[0];
  const currentTypeObj = GIFT_TYPES.find((t) => t.id === effectiveType) ?? GIFT_TYPES[0];
  const currentOccasionObj = OCCASIONS.find((o) => o.id === effectiveOccasion) ?? OCCASIONS[0];

  const selectedAddonObjs = availableAddons.filter((a) => selectedAddons.includes(a.id));
  const addonLabels = selectedAddonObjs.map((a) => a.label).join(", ");

  // Price estimate math
  const basePrice = currentTypeObj.basePrice;
  const addonSum = selectedAddonObjs.reduce((acc, curr) => acc + curr.estPrice, 0);
  const estMin = basePrice + addonSum;
  const estMax = estMin + 300;

  const generatedWhatsAppText = `Hi Shiqueen! I am customizing a ${currentTypeObj.label} (${currentOccasionObj.label}).
Selected Inclusions: ${addonLabels || "Standard Curation"}.
Estimated Range: ₹${estMin.toLocaleString("en-IN")} - ₹${estMax.toLocaleString("en-IN")}.
Please share customization photos, catalog and final pricing!`;

  const customizerUrl = SOCIAL_LINKS.whatsappUrl(generatedWhatsAppText);

  return (
    <section
      id="gifting-studio"
      aria-label="Shiqueen Bespoke Gifting Studio"
      className="border-b border-[#E5DEC9] bg-[#FAF7F2] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">
              Bespoke Gifting Studio
            </p>
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#231C16] sm:text-4xl lg:text-5xl">
            Customized Hampers &amp;{" "}
            <span className="italic text-[#8C671A]">Jewelry Bouquets</span>
          </h2>
          <p className="mt-2.5 text-xs font-medium leading-relaxed text-[#231C16]/75 sm:text-sm lg:text-base xl:font-semibold xl:text-[#231C16]/85">
            Unforgettable surprises tailor-made for Birthdays, Anniversaries, Bridesmaids &amp; Special Milestones. Handcrafted with love and delivered across India.
          </p>
        </div>

        {/* 2 Signature Offerings: Side-by-Side Dual Luxury Showcase (Perfect Symmetry on Widescreen) */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Spotlight 1: The Queen's Luxury Keepsake Hamper */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#DFC99B] bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-[#8C671A] hover:shadow-xl">
            <div>
              {/* Photo Stage (Clean, Symmetrical Framing) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FAF7F2] shadow-sm">
                <Image
                  src="/images/categories/cat-hampers.jpg"
                  alt="Shiqueen Customized Luxury Gift Hamper with Gold Watch and Chocolates"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-104"
                />
              </div>

              {/* Header Eyebrow & Title */}
              <div className="mt-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-px w-6 bg-[#8C671A]" aria-hidden="true" />
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#8C671A]">
                    Signature Gifting Box
                  </p>
                </div>

                <h3 className="mt-2 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl">
                  The Queen&apos;s Luxury{" "}
                  <span className="italic text-[#8C671A]">Keepsake Hamper</span>
                </h3>

                {/* Occasion Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="font-sans text-xs font-medium text-[#231C16]/70 xl:font-semibold xl:text-[#231C16]/82">Perfect for:</span>
                  <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                    Birthdays
                  </span>
                  <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                    Anniversaries
                  </span>
                  <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                    Bridesmaids
                  </span>
                </div>

                {/* High-Contrast Readable Description */}
                <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-[#231C16]/80 font-medium xl:font-semibold xl:text-[#231C16]/90">
                  A grand rigid keepsake gift box lined with velvet and warm glow, curated with waterproof anti-tarnish jewelry, watches, chocolates, and handwritten notes.
                </p>

                {/* 4 Luxury Inclusion Cards with High Contrast (2x2 Grid) */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <WatchSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">18K Watch &amp; Jewelry</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Waterproof &amp; anti-tarnish</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <ChocolateSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">Ferrero Rocher Box</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Golden sweet indulgence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <SparkleAuraSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">Fairy Lights &amp; Florals</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Magical warm unboxing glow</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <LoveLetterSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">Handwritten Letter</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Custom personalized note</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button & Trust Microcopy */}
            <div className="mt-8 border-t border-[#F0EAE0] pt-5">
              <a
                href={SOCIAL_LINKS.whatsappUrl(
                  "Hi Shiqueen! I want to order/customize The Queen's Luxury Gift Hamper."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center inline-flex items-center gap-2 rounded-full bg-[#8C671A] hover:bg-[#735312] px-6 py-4 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:shadow-md"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#F7DFC2]" />
                <span>Customize This Hamper on WhatsApp</span>
              </a>
              <p className="mt-3 text-center font-sans text-xs text-[#231C16]/80">
                ✦ <strong>Video Preview on WhatsApp</strong> before dispatch • Pan-India Delivery
              </p>
            </div>
          </div>

          {/* Spotlight 2: Signature Everlasting Jewelry Bouquet */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#DFC99B] bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:border-[#8C671A] hover:shadow-xl">
            <div>
              {/* Photo Stage (Clean, Symmetrical Framing) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FAF7F2] shadow-sm">
                <Image
                  src="/images/categories/cat-bouquets.jpg"
                  alt="Shiqueen Signature Handcrafted Jewelry Bouquet with Roses and Gold Necklace"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-104"
                />
              </div>

              {/* Header Eyebrow & Title */}
              <div className="mt-6">
                <div className="inline-flex items-center gap-2">
                  <span className="h-px w-6 bg-[#8C671A]" aria-hidden="true" />
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#8C671A]">
                    Viral Gifting Innovation
                  </p>
                </div>

                <h3 className="mt-2 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl">
                  Signature Everlasting{" "}
                  <span className="italic text-[#8C671A]">Jewelry Bouquet</span>
                </h3>

                {/* Occasion Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="font-sans text-xs font-medium text-[#231C16]/70 xl:font-semibold xl:text-[#231C16]/82">Perfect for:</span>
                  <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                    Birthdays
                  </span>
                  <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                    Romance &amp; Proposal
                  </span>
                  <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                    Anniversaries
                  </span>
                </div>

                {/* High-Contrast Readable Description */}
                <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-[#231C16]/80 font-medium xl:font-semibold xl:text-[#231C16]/90">
                  Everlasting preserved blooms that never wilt, lovingly nested with 18K gold-toned anti-tarnish jewelry, multi-layered frosted wrapping, and golden satin bow.
                </p>

                {/* 4 Luxury Inclusion Cards with High Contrast (2x2 Grid) */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <DiamondSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">18K Necklace &amp; Hoops</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Waterproof demi-fine pieces</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <BotanicalRoseSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">Everlasting Silk Blooms</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Preserved petals that never wilt</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <RibbonBowSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">Pastel Frosted Wrap</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Luxury satin bow &amp; tag</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <TransitBoxSVG />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">Anti-Damage Flower Box</p>
                      <p className="font-sans text-xs text-[#231C16]/70 font-medium xl:font-semibold xl:text-[#231C16]/82">Safe Pan-India delivery transit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button & Trust Microcopy */}
            <div className="mt-8 border-t border-[#F0EAE0] pt-5">
              <a
                href={SOCIAL_LINKS.whatsappUrl(
                  "Hi Shiqueen! I want to order/customize a Signature Jewelry Bouquet."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center inline-flex items-center gap-2 rounded-full bg-[#8C671A] hover:bg-[#735312] px-6 py-4 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:shadow-md"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#F7DFC2]" />
                <span>Customize This Bouquet on WhatsApp</span>
              </a>
              <p className="mt-3 text-center font-sans text-xs text-[#231C16]/80">
                ✦ <strong>Video Preview on WhatsApp</strong> before dispatch • Pan-India Delivery
              </p>
            </div>
          </div>
        </div>

        {/* 3. The Guided Bespoke Studio: Widescreen-Optimized Compact Single-View Customizer */}
        <div className="mt-14 sm:mt-16 lg:mt-20">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-[#8C671A]/10 px-3.5 py-1 font-sans text-[11px] font-bold uppercase tracking-widest text-[#8C671A]">
              Interactive Customizer
            </span>
            <h3 className="mt-2.5 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl lg:text-4xl">
              Build Your Custom Surprise
            </h3>
            <p className="mt-1 font-sans text-xs font-medium text-[#231C16]/75 sm:text-sm xl:text-[15px] xl:font-semibold xl:text-[#231C16]/85">
              Select your preferred creation, occasion theme &amp; luxury add-ons below with live WhatsApp order preview.
            </p>
          </div>

          {/* STEP 1: Widescreen Horizontal Cinema Switcher (Fits in 1 screen on 1080p!) */}
          {activeStep === 1 && (
            <div className="mx-auto mt-6 max-w-6xl xl:max-w-7xl">
              {/* 3 Refined Switcher Pills (Warm Gold Palette - No Harsh Black) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-white border border-[#DFC99B] shadow-xs">
                {GIFT_TYPES.map((t) => {
                  const isViewing = previewType === t.id;
                  const isChosen = selectedType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPreviewType(t.id)}
                      className={`group flex items-center justify-between rounded-xl py-2.5 px-3.5 sm:px-4 text-left transition-all cursor-pointer ${
                        isViewing
                          ? "bg-[#8C671A] text-white shadow-sm ring-1 ring-[#8C671A]"
                          : "bg-transparent text-[#231C16] hover:bg-[#FAF6EE]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans text-xs font-bold sm:text-sm">
                            {t.label}
                          </span>
                          {t.badge && (
                            <span
                              className={`rounded-full px-1.5 py-0.2 font-sans text-[9px] font-bold uppercase tracking-wider ${
                                isViewing
                                  ? "bg-white/20 text-white"
                                  : "bg-[#8C671A]/10 text-[#8C671A]"
                              }`}
                            >
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className={`mt-0.5 font-sans text-[11px] ${
                            isViewing ? "text-[#FAF6EE]" : "text-[#8C671A] font-semibold"
                          }`}
                        >
                          {t.startingPrice}
                        </p>
                      </div>
                      {isChosen && (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#8C671A] text-[10px] font-bold shadow-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Horizontal Showcase Card (50/50 Split - Widescreen Breadth, Compact Height) */}
              <div className="mt-4 overflow-hidden rounded-3xl border border-[#DFC99B] bg-white shadow-md transition-all duration-300">
                <div className="grid md:grid-cols-12 items-stretch">
                  {/* Left 50%: Cinema HD Photo */}
                  <div className="md:col-span-6 relative min-h-[260px] sm:min-h-[300px] lg:min-h-[330px] w-full overflow-hidden bg-[#FAF7F2]">
                    <Image
                      src={currentPreviewObj.image}
                      alt={currentPreviewObj.label}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 hover:scale-102"
                    />
                  </div>

                  {/* Right 50%: Editorial Details & Warm Gold CTA */}
                  <div className="md:col-span-6 flex flex-col justify-between p-5 sm:p-7 lg:p-8">
                    <div>
                      <div className="inline-flex items-center gap-2">
                        <span className="h-px w-5 bg-[#8C671A]" />
                        <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8C671A]">
                          Base Creation Format
                        </p>
                      </div>

                      <h4 className="mt-1 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl">
                        {currentPreviewObj.label}
                      </h4>
                      <p className="mt-1.5 font-sans text-xs font-medium text-[#231C16]/75 leading-relaxed sm:text-[13px] xl:text-sm xl:font-semibold xl:text-[#231C16]/85">
                        {currentPreviewObj.subtitle}
                      </p>

                      {/* Inclusions Bullets */}
                      <ul className="mt-3.5 space-y-1.5 border-t border-[#F0EAE0] pt-3">
                        {currentPreviewObj.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 font-sans text-xs font-medium text-[#231C16]/85 xl:text-[13px] xl:font-semibold"
                          >
                            <span className="text-[#8C671A] font-bold text-xs">✦</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Row */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#F0EAE0] pt-4">
                      <div>
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#231C16]/65 xl:text-[11px] xl:font-bold">
                          Starting From
                        </p>
                        <p className="font-sans text-2xl font-bold text-[#8C671A]">
                          {currentPreviewObj.startingPrice}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleCommitType(currentPreviewObj.id);
                          setActiveStep(2);
                        }}
                        className="inline-flex items-center justify-center rounded-full bg-[#8C671A] hover:bg-[#735312] px-7 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg cursor-pointer"
                      >
                        <span>Select &amp; Proceed to Step 2</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: The Occasion Selection Stage (Widescreen 4-Col Grid) */}
          {activeStep === 2 && (
            <div className="mx-auto mt-6 max-w-6xl xl:max-w-7xl">
              <div className="mb-4 text-center">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#8C671A]">
                  Step 2 of 3
                </span>
                <h4 className="mt-1 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl">
                  Choose the Special Occasion
                </h4>
                <p className="mt-1 font-sans text-xs text-[#231C16]/75 sm:text-sm">
                  Add-ons, notes, and ribbon styling automatically adapt to your celebration theme
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {OCCASIONS.map((o) => {
                  const isSelected = selectedOccasion === o.id;
                  return (
                    <div
                      key={o.id}
                      onClick={() => handleCommitOccasion(o.id)}
                      className={`group flex flex-col justify-between rounded-3xl border bg-white p-5 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "border-[#8C671A] shadow-md ring-2 ring-[#8C671A]/30 scale-[1.01]"
                          : "border-[#E5DEC9] shadow-xs hover:border-[#8C671A]/60 hover:shadow-sm"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-2.5 py-0.5 font-sans text-[10px] font-semibold text-[#8C671A]">
                            {o.iconTag}
                          </span>
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                              isSelected
                                ? "border-[#8C671A] bg-[#8C671A] text-white"
                                : "border-[#D6CEBC] text-transparent group-hover:border-[#8C671A]"
                            }`}
                          >
                            ✓
                          </div>
                        </div>

                        <h5 className="mt-3 font-serif text-lg font-bold text-[#231C16]">
                          {o.label}
                        </h5>
                        <p className="mt-1.5 font-sans text-xs text-[#666666] leading-relaxed">
                          {o.subtitle}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-[#F0EAE0] pt-2.5">
                        <p className="font-sans text-[10.5px] font-medium text-[#8C671A]">
                          ✦ {o.themeNote}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#666666] transition hover:text-[#231C16] cursor-pointer"
                >
                  <span>Back to Creation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedOccasion !== "") {
                      setActiveStep(3);
                    } else {
                      handleCommitOccasion("birthday");
                      setActiveStep(3);
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#8C671A] hover:bg-[#735312] px-8 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg cursor-pointer"
                >
                  <span>
                    {selectedOccasion !== ""
                      ? "Continue to Step 3: Curate Add-ons"
                      : "Select an Occasion to Proceed"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: The Grand Finale (Naturally Balanced Showcase + Inclusions Grid) */}
          {activeStep === 3 && (
            <div className="mx-auto mt-6 max-w-6xl xl:max-w-7xl">
              <div className="mb-4 text-center">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#8C671A]">
                  Step 3 of 3 • The Final Touch
                </span>
                <h4 className="mt-1 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl">
                  Curate Your Inclusions &amp; Finalize
                </h4>
                <p className="mt-1 font-sans text-xs text-[#231C16]/75 sm:text-sm">
                  Toggle your desired luxury inclusions below. Price range updates live!
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-12 items-stretch">
                {/* Left (5 cols): Masterpiece Summary Stage */}
                <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border-2 border-[#DFC99B] bg-white p-6 shadow-md sm:p-7">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8C671A] opacity-75"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8C671A]"></span>
                        </span>
                        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C671A]">
                          Your Custom Masterpiece
                        </p>
                      </div>
                      <span className="rounded-full bg-[#8C671A]/10 px-2.5 py-0.5 font-sans text-[10.5px] font-bold text-[#8C671A]">
                        {selectedAddons.length} Items Selected
                      </span>
                    </div>

                    {/* Photo Stage */}
                    <div className="relative mt-3.5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2]">
                      <Image
                        src={currentTypeObj.image}
                        alt={currentTypeObj.label}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </div>

                    {/* Title & Occasion */}
                    <div className="mt-3.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#8C671A]">
                          {currentOccasionObj.label}
                        </span>
                        <span className="font-sans text-[11px] text-[#666666]">
                          Bespoke Edition
                        </span>
                      </div>
                      <h5 className="mt-1 font-serif text-2xl font-bold text-[#231C16]">
                        {currentTypeObj.label}
                      </h5>
                    </div>

                    {/* Trust Highlights */}
                    <div className="mt-3.5 space-y-1.5 border-t border-[#F0EAE0] pt-3 text-[11.5px] text-[#231C16]/80">
                      <p>✦ <strong>Video Preview on WhatsApp</strong> before final dispatch</p>
                      <p>✦ 100% Anti-Tarnish Demi-Fine Jewelry</p>
                      <p>✦ 24-48 hr Express Pan-India Shipping</p>
                    </div>
                  </div>

                  {/* Price Box & WhatsApp Button */}
                  <div className="mt-5 border-t border-[#F0EAE0] pt-4">
                    <div className="rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2] p-3.5">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#8C671A]">
                        Estimated Price Range
                      </p>
                      <p className="mt-0.5 font-sans text-2xl font-bold text-[#231C16] sm:text-3xl">
                        ₹{estMin.toLocaleString("en-IN")}{" "}
                        <span className="text-base font-normal text-[#666666]">
                          – ₹{estMax.toLocaleString("en-IN")}
                        </span>
                      </p>
                      <p className="mt-1 font-sans text-[10px] text-[#777777]">
                        *Exact quote confirmed with Stylist on WhatsApp
                      </p>
                    </div>

                    <a
                      href={customizerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#8C671A] hover:bg-[#735312] py-3.5 px-6 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <WhatsAppIcon className="h-4 w-4 text-[#F7DFC2]" />
                      <span>Order This Exact Box on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Right (7 cols): Spacious 2-Column Inclusions Grid (Zero Scrollbar) */}
                <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs sm:p-7">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-serif text-2xl font-bold text-[#231C16]">
                          Curated Inclusions
                        </h5>
                        <p className="mt-0.5 font-sans text-xs text-[#666666]">
                          Tailored specially for {currentTypeObj.label} • {currentOccasionObj.label}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#8C671A]/10 px-3 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                        {selectedAddons.length} of {availableAddons.length} Included
                      </span>
                    </div>

                    {/* 6 Add-ons Grid (2x3) with complete visibility and NO SCROLLBAR */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {availableAddons.map((a) => {
                        const isChecked = selectedAddons.includes(a.id);
                        return (
                          <div
                            key={a.id}
                            onClick={() => toggleAddon(a.id)}
                            className={`flex items-start justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                              isChecked
                                ? "border-[#8C671A] bg-[#FAF6EE] shadow-xs ring-1 ring-[#8C671A]/20"
                                : "border-[#E5DEC9] bg-white hover:border-[#8C671A]/50 hover:bg-[#FAF7F2]/60"
                            }`}
                          >
                            <div className="pr-3">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-sans text-xs font-bold text-[#231C16]">
                                  {a.label}
                                </span>
                                {a.estPrice > 0 ? (
                                  <span className="rounded-full bg-[#8C671A]/10 px-1.5 py-0.2 font-sans text-[10px] font-bold text-[#8C671A]">
                                    +₹{a.estPrice}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-[#231C16]/5 px-1.5 py-0.2 font-sans text-[10px] font-medium text-[#666666]">
                                    Included
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 font-sans text-[11px] text-[#666666] leading-relaxed">
                                {a.desc}
                              </p>
                            </div>
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                                isChecked
                                  ? "border-[#8C671A] bg-[#8C671A] text-white"
                                  : "border-[#D6CEBC] bg-white text-transparent"
                              }`}
                            >
                              ✓
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#F0EAE0] pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#666666] transition hover:text-[#231C16] cursor-pointer"
                    >
                      <span>Back to Occasion</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#8C671A] hover:underline cursor-pointer"
                    >
                      <span>Change Creation (Step 1)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
