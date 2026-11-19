"use client";

import Image from "next/image";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/Header";
import { useSite, useWhatsApp } from "@/components/site/SiteProvider";
import { splitHighlight } from "@/lib/site-types";
import type { GiftingContent } from "@/lib/content/types";

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

const SPOTLIGHT_ICONS = [WatchSVG, ChocolateSVG, SparkleAuraSVG, LoveLetterSVG, DiamondSVG, BotanicalRoseSVG, RibbonBowSVG, TransitBoxSVG];

function addonsFor(gift: GiftingContent["gift_types"][number] | undefined, occasionKey: string) {
  return (gift?.addons ?? [])
    .map((a, i) => ({ ...a, id: `${i}` }))
    .filter((a) => a.occasions.length === 0 || a.occasions.includes(occasionKey));
}

function Spotlight({ spot, index }: { spot: GiftingContent["spotlights"][number]; index: number }) {
  const whatsapp = useWhatsApp();
  const [before, highlight, after] = splitHighlight(spot.title, spot.highlight);
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#DFC99B] bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#8C671A] hover:shadow-xl sm:p-8">
      <div>
        {spot.image && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#FAF7F2] shadow-sm">
            <Image
              src={spot.image}
              alt={spot.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-104"
            />
          </div>
        )}
        <div className="mt-6">
          {spot.eyebrow && (
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-[#8C671A]" aria-hidden="true" />
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#8C671A]">{spot.eyebrow}</p>
            </div>
          )}
          <h3 className="mt-2 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl">
            {before}
            {highlight && <span className="italic text-[#8C671A]">{highlight}</span>}
            {after}
          </h3>
          {spot.perfect_for.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="font-sans text-xs font-medium text-[#231C16]/70 xl:font-semibold xl:text-[#231C16]/82">Perfect for:</span>
              {spot.perfect_for.map((tag) => (
                <span key={tag} className="rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 font-sans text-xs font-semibold text-[#8C671A]">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {spot.description && (
            <p className="mt-4 font-sans text-sm font-medium leading-relaxed text-[#231C16]/80 sm:text-base xl:font-semibold xl:text-[#231C16]/90">{spot.description}</p>
          )}
          {spot.items.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {spot.items.map((item, i) => {
                const Icon = SPOTLIGHT_ICONS[(index * 4 + i) % SPOTLIGHT_ICONS.length];
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#DFC99B]/80 bg-[#FAF7F2] p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFC99B] bg-[#FAF6EE] text-[#8C671A]">
                      <Icon />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-bold text-[#231C16]">{item.title}</p>
                      <p className="font-sans text-xs font-medium text-[#231C16]/70 xl:font-semibold xl:text-[#231C16]/82">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {spot.cta_label && (
        <div className="mt-8 border-t border-[#F0EAE0] pt-5">
          <a
            href={whatsapp(spot.whatsapp_message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8C671A] px-6 py-4 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#735312] hover:shadow-md sm:text-sm"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#F7DFC2]" />
            <span>{spot.cta_label}</span>
          </a>
          {spot.footnote && <p className="mt-3 text-center font-sans text-xs text-[#231C16]/80">{spot.footnote}</p>}
        </div>
      )}
    </div>
  );
}

export default function GiftingStudio() {
  const g = useSite().content.gifting;
  const whatsapp = useWhatsApp();

  const GIFT_TYPES = g.gift_types.map((t, i) => ({
    id: t.key || `type-${i}`,
    label: t.label,
    subtitle: t.subtitle,
    badge: t.badge,
    basePrice: t.base_price,
    image: t.image || "/images/shiqueen-logo-2026b.png",
    features: t.features,
    source: t,
  }));
  const OCCASIONS = g.occasions.map((o, i) => ({
    id: o.key || `occasion-${i}`,
    label: o.label,
    subtitle: o.subtitle,
    themeNote: o.theme_note,
    iconTag: o.tag,
  }));

  const firstType = GIFT_TYPES[0]?.id ?? "";
  const firstOccasion = OCCASIONS[0]?.id ?? "";

  // Stepper state: 1 = Creation, 2 = Occasion, 3 = Finalize
  const [activeStep, setActiveStep] = useState<number>(1);
  const [previewType, setPreviewType] = useState<string>(firstType);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");

  const effectiveType = selectedType || previewType;
  const effectiveOccasion = selectedOccasion || firstOccasion;
  const typeById = (id: string) => GIFT_TYPES.find((t) => t.id === id) ?? GIFT_TYPES[0];
  const getAddons = (typeId: string, occasionId: string) => addonsFor(typeById(typeId)?.source, occasionId);

  const availableAddons = getAddons(effectiveType, effectiveOccasion);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(() =>
    getAddons(firstType, firstOccasion)
      .filter((a) => a.default_on)
      .map((a) => a.id)
  );

  const handleCommitType = (typeId: string) => {
    setSelectedType(typeId);
    setPreviewType(typeId);
    setSelectedAddons(getAddons(typeId, effectiveOccasion).filter((a) => a.default_on).map((a) => a.id));
  };

  const handleCommitOccasion = (occasionId: string) => {
    setSelectedOccasion(occasionId);
    setSelectedAddons(getAddons(effectiveType, occasionId).filter((a) => a.default_on).map((a) => a.id));
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  if (!g.show) return null;

  const currentPreviewObj = typeById(previewType);
  const currentTypeObj = typeById(effectiveType);
  const currentOccasionObj = OCCASIONS.find((o) => o.id === effectiveOccasion) ?? OCCASIONS[0];

  const selectedAddonObjs = availableAddons.filter((a) => selectedAddons.includes(a.id));
  const addonLabels = selectedAddonObjs.map((a) => a.label).join(", ");

  const basePrice = currentTypeObj?.basePrice ?? 0;
  const addonSum = selectedAddonObjs.reduce((acc, curr) => acc + curr.price, 0);
  const estMin = basePrice + addonSum;
  const estMax = estMin + (g.estimate_spread || 0);

  const generatedWhatsAppText = `Hi! I am customizing a ${currentTypeObj?.label ?? "gift"} (${currentOccasionObj?.label ?? ""}).
Selected Inclusions: ${addonLabels || "Standard Curation"}.
Estimated Range: ₹${estMin.toLocaleString("en-IN")} - ₹${estMax.toLocaleString("en-IN")}.
Please share customization photos, catalog and final pricing!`;
  const customizerUrl = whatsapp(generatedWhatsAppText);
  const [titleBefore, titleHighlight, titleAfter] = splitHighlight(g.title, g.highlight);

  return (
    <section
      id="gifting-studio"
      aria-label="Bespoke Gifting Studio"
      className="border-b border-[#E5DEC9] bg-[#FAF7F2] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">{g.eyebrow}</p>
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#231C16] sm:text-4xl lg:text-5xl">
            {titleBefore}
            {titleHighlight && <span className="italic text-[#8C671A]">{titleHighlight}</span>}
            {titleAfter}
          </h2>
          <p className="mt-2.5 text-xs font-medium leading-relaxed text-[#231C16]/75 sm:text-sm lg:text-base xl:font-semibold xl:text-[#231C16]/85">
            {g.description}
          </p>
        </div>

        {g.spotlights.length > 0 && (
          <div className={`mt-12 grid grid-cols-1 gap-8 lg:gap-10 ${g.spotlights.length > 1 ? "lg:grid-cols-2" : ""}`}>
            {g.spotlights.map((spot, i) => (
              <Spotlight key={i} spot={spot} index={i} />
            ))}
          </div>
        )}

        {/* 3. The Guided Bespoke Studio: Widescreen-Optimized Compact Single-View Customizer */}
        {g.customizer_show && GIFT_TYPES.length > 0 && OCCASIONS.length > 0 && (
        <div className="mt-14 sm:mt-16 lg:mt-20">
          {/* Section Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-[#8C671A]/10 px-3.5 py-1 font-sans text-[11px] font-bold uppercase tracking-widest text-[#8C671A]">
              {g.customizer_eyebrow}
            </span>
            <h3 className="mt-2.5 font-serif text-2xl font-bold text-[#231C16] sm:text-3xl lg:text-4xl">
              {g.customizer_title}
            </h3>
            <p className="mt-1 font-sans text-xs font-medium text-[#231C16]/75 sm:text-sm xl:text-[15px] xl:font-semibold xl:text-[#231C16]/85">
              {g.customizer_text}
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
                          From ₹{t.basePrice.toLocaleString("en-IN")}
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
                        <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#231C16]/65 xl:text-[11px]">
                          STARTING FROM
                        </p>
                        <p className="font-sans text-2xl font-bold text-[#8C671A]">
                          ₹{currentPreviewObj.basePrice.toLocaleString("en-IN")}
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

              <div className={`grid gap-4 sm:grid-cols-2 ${OCCASIONS.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
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
                      handleCommitOccasion(OCCASIONS[0].id);
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
                    {g.finale_perks.length > 0 && (
                      <div className="mt-3.5 space-y-1.5 border-t border-[#F0EAE0] pt-3 text-[11.5px] text-[#231C16]/80">
                        {g.finale_perks.map((perk) => (
                          <p key={perk}>✦ {perk}</p>
                        ))}
                      </div>
                    )}
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
                        {g.estimate_note}
                      </p>
                    </div>

                    <a
                      href={customizerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#8C671A] hover:bg-[#735312] py-3.5 px-6 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <WhatsAppIcon className="h-4 w-4 text-[#F7DFC2]" />
                      <span>{g.final_cta}</span>
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
                      {availableAddons.map((addon) => {
                        const a = { ...addon, estPrice: addon.price, desc: addon.text };
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
        )}
      </div>
    </section>
  );
}
