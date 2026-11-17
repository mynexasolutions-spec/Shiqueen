"use client";

import Image from "next/image";
import { useState } from "react";
import { BRAND, SOCIAL_LINKS } from "@/lib/brand-data";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/Header";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <footer
      id="footer"
      aria-label="Site Footer"
      className="border-t border-[#332A21] bg-[#1A1410] text-[#FAF6EE]"
    >
      {/* ========================================================= */}
      {/* 1. MOBILE COMPACT ACCORDION FOOTER (lg:hidden)            */}
      {/* ========================================================= */}
      <div className="px-5 py-8 lg:hidden">
        {/* Brand Header */}
        <div className="flex items-center gap-3.5">
          <div
            style={{ position: "relative" }}
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#8C671A] bg-[#FAF6EE] shadow-md"
          >
            <Image
              src={BRAND.logoPath}
              alt="Shiqueen Logo"
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold tracking-[0.14em] text-white">
              {BRAND.name}
            </h3>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFC99B]">
              {BRAND.tagline}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pan-India Orders Open</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[#FAF6EE]/75">
          India&apos;s premier demi-fine anti-tarnish jewelry atelier &amp; bespoke gifting studio. Waterproof 18K gold vacuum PVD plating.
        </p>

        {/* Micro Trust Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-[10px] font-medium text-[#DFC99B]">
            ✦ 100% Waterproof
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-[10px] font-medium text-[#DFC99B]">
            ✦ Zero Green Skin
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-[10px] font-medium text-[#DFC99B]">
            ✦ 18K Vacuum PVD
          </span>
        </div>

        {/* Social Channels Row */}
        <div className="mt-4 flex items-center gap-2.5 pb-5 border-b border-[#332A21]">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FAF6EE] transition hover:bg-[#8C671A]"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FAF6EE] transition hover:bg-[#8C671A]"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL_LINKS.whatsappUrl("Hi Shiqueen! I would like to inquire about your collections.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </a>
          <span className="text-[11px] text-[#FAF6EE]/60 ml-1">Follow &amp; Chat with us</span>
        </div>

        {/* Accordion 1: Collections */}
        <div className="border-b border-[#332A21]">
          <button
            type="button"
            onClick={() => toggleSection("collections")}
            className="flex w-full items-center justify-between py-3.5 text-left font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B]"
            aria-expanded={openSection === "collections"}
          >
            <span>Jewelry Collections</span>
            <span className="text-base font-light text-[#DFC99B] transition-transform">
              {openSection === "collections" ? "−" : "+"}
            </span>
          </button>
          {openSection === "collections" && (
            <ul className="space-y-2 pb-3.5 text-xs text-[#FAF6EE]/80 animate-in fade-in duration-200">
              <li>
                <a href="#categories" className="block py-0.5 hover:text-[#DFC99B]">
                  Anti-Tarnish Necklaces
                </a>
              </li>
              <li>
                <a href="#categories" className="block py-0.5 hover:text-[#DFC99B]">
                  Waterproof Bracelets &amp; Cuffs
                </a>
              </li>
              <li>
                <a href="#categories" className="block py-0.5 hover:text-[#DFC99B]">
                  Hypoallergenic Rings
                </a>
              </li>
              <li>
                <a href="#categories" className="block py-0.5 hover:text-[#DFC99B]">
                  Everyday &amp; Party Earrings
                </a>
              </li>
              <li>
                <a href="#categories" className="block py-0.5 hover:text-[#DFC99B]">
                  Royale Gold Watches
                </a>
              </li>
              <li>
                <a href="#categories" className="block py-0.5 hover:text-[#DFC99B]">
                  Festive &amp; Ethnic Sets
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="block py-0.5 hover:text-[#DFC99B]">
                  Trending Royal Creations
                </a>
              </li>
            </ul>
          )}
        </div>

        {/* Accordion 2: Gifting Studio */}
        <div className="border-b border-[#332A21]">
          <button
            type="button"
            onClick={() => toggleSection("gifting")}
            className="flex w-full items-center justify-between py-3.5 text-left font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B]"
            aria-expanded={openSection === "gifting"}
          >
            <span>Bespoke Gifting Studio</span>
            <span className="text-base font-light text-[#DFC99B] transition-transform">
              {openSection === "gifting" ? "−" : "+"}
            </span>
          </button>
          {openSection === "gifting" && (
            <ul className="space-y-2 pb-3.5 text-xs text-[#FAF6EE]/80 animate-in fade-in duration-200">
              <li>
                <a href="#gifting-studio" className="block py-0.5 hover:text-[#DFC99B]">
                  The Queen&apos;s Keepsake Hamper
                </a>
              </li>
              <li>
                <a href="#gifting-studio" className="block py-0.5 hover:text-[#DFC99B]">
                  Signature Jewelry Bouquets
                </a>
              </li>
              <li>
                <a href="#gifting-studio" className="block py-0.5 hover:text-[#DFC99B]">
                  Grand Celebration Combo Box
                </a>
              </li>
              <li>
                <a href="#gifting-studio" className="block py-0.5 hover:text-[#DFC99B]">
                  Bridal Shower &amp; Birthday Favors
                </a>
              </li>
              <li>
                <a href="#why-shiqueen" className="block py-0.5 hover:text-[#DFC99B]">
                  WhatsApp Video Preview Service
                </a>
              </li>
              <li>
                <a href="#why-shiqueen" className="block py-0.5 hover:text-[#DFC99B]">
                  18K Anti-Tarnish Lifetime Care
                </a>
              </li>
            </ul>
          )}
        </div>

        {/* Accordion 3: Concierge & Studio */}
        <div className="border-b border-[#332A21]">
          <button
            type="button"
            onClick={() => toggleSection("concierge")}
            className="flex w-full items-center justify-between py-3.5 text-left font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B]"
            aria-expanded={openSection === "concierge"}
          >
            <span>Concierge &amp; Studio</span>
            <span className="text-base font-light text-[#DFC99B] transition-transform">
              {openSection === "concierge" ? "−" : "+"}
            </span>
          </button>
          {openSection === "concierge" && (
            <div className="space-y-3 pb-3.5 text-xs text-[#FAF6EE]/80 animate-in fade-in duration-200">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#DFC99B]">
                  Styling &amp; Order Support:
                </p>
                <a
                  href={SOCIAL_LINKS.whatsappUrl("Hi Shiqueen! I would like to place an order / speak with a stylist.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-300"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span>WhatsApp: Instant Stylist Chat</span>
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#DFC99B]">
                  Community:
                </p>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#DFC99B]"
                >
                  Instagram: <span className="text-[#DFC99B]">{SOCIAL_LINKS.instagramHandle}</span>
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#DFC99B]">
                  Fulfillment &amp; Shipping:
                </p>
                <p className="mt-0.5 text-[#FAF6EE]/70">
                  Delivering to 19,000+ Pin Codes across India.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile 2x2 Trust Badges */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10.5px] text-[#DFC99B]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8C671A]">✦</span>
            <span className="text-white/85">Insured Shipping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8C671A]">✦</span>
            <span className="text-white/85">Video Preview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8C671A]">✦</span>
            <span className="text-white/85">100% Waterproof</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8C671A]">✦</span>
            <span className="text-white/85">Secure Checkout</span>
          </div>
        </div>

        {/* Mobile Copyright & Legal */}
        <div className="mt-5 pt-4 border-t border-[#332A21] text-center text-[10px] text-[#FAF6EE]/60 space-y-2">
          <p>
            &copy; 2026 <span className="font-serif font-bold text-white tracking-wider">SHIQUEEN</span>. Crafted For Every Queen.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[10px]">
            <a href="#why-shiqueen" className="hover:text-[#DFC99B]">Warranty</a>
            <span>•</span>
            <a href="#why-shiqueen" className="hover:text-[#DFC99B]">Care Guide</a>
            <span>•</span>
            <a href="#gifting-studio" className="hover:text-[#DFC99B]">Delivery Policy</a>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP FULL-SCALE LUXURY FOOTER (hidden lg:block)     */}
      {/* ========================================================= */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] px-10 py-12 2xl:py-16 xl:px-14 2xl:px-20">
          <div className="grid grid-cols-12 gap-8 2xl:gap-14">
            {/* Column 1: Brand Atelier & Royal Logo */}
            <div className="col-span-4 space-y-4 2xl:space-y-5">
              <div className="flex items-center gap-4 sm:gap-5">
                <div
                  style={{ position: "relative" }}
                  className="relative h-20 w-20 2xl:h-24 2xl:w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#8C671A] bg-[#FAF6EE] shadow-lg shadow-black/50"
                >
                  <Image
                    src={BRAND.logoPath}
                    alt="Shiqueen Royal Crown Logo"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-serif text-xl 2xl:text-3xl font-bold tracking-[0.16em] text-white">
                    {BRAND.name}
                  </h3>
                  <p className="font-sans text-[11px] 2xl:text-sm font-bold uppercase tracking-[0.24em] text-[#DFC99B]">
                    {BRAND.tagline}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Pan-India Orders Open</span>
                  </div>
                </div>
              </div>

              <p className="font-sans text-xs 2xl:text-[14px] leading-relaxed text-[#FAF6EE]/75 max-w-sm 2xl:max-w-md">
                India&apos;s premier demi-fine anti-tarnish jewelry atelier &amp; bespoke gifting studio.
                Crafted on medical-grade 316L surgical steel with 18K gold vacuum PVD plating—engineered to shine for years without tarnishing or turning skin green.
              </p>

              <div className="flex flex-wrap gap-2 2xl:gap-2.5 pt-0.5">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 2xl:px-3 2xl:py-1 font-sans text-[10.5px] 2xl:text-xs font-medium text-[#DFC99B]">
                  ✦ 100% Waterproof
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 2xl:px-3 2xl:py-1 font-sans text-[10.5px] 2xl:text-xs font-medium text-[#DFC99B]">
                  ✦ Zero Green Skin
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 2xl:px-3 2xl:py-1 font-sans text-[10.5px] 2xl:text-xs font-medium text-[#DFC99B]">
                  ✦ 18K Vacuum PVD
                </span>
              </div>

              <div className="flex items-center gap-2.5 2xl:gap-3 pt-1">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Shiqueen on Instagram"
                  className="flex h-9 w-9 2xl:h-10 2xl:w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FAF6EE] transition-all hover:border-[#8C671A] hover:bg-[#8C671A] hover:text-white"
                >
                  <InstagramIcon className="h-4 w-4 2xl:h-4.5 2xl:w-4.5" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Shiqueen on Facebook"
                  className="flex h-9 w-9 2xl:h-10 2xl:w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FAF6EE] transition-all hover:border-[#8C671A] hover:bg-[#8C671A] hover:text-white"
                >
                  <FacebookIcon className="h-4 w-4 2xl:h-4.5 2xl:w-4.5" />
                </a>
                <a
                  href={SOCIAL_LINKS.whatsappUrl("Hi Shiqueen! I would like to inquire about your collections.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Shiqueen on WhatsApp"
                  className="flex h-9 w-9 2xl:h-10 2xl:w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-emerald-400 transition-all hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4 2xl:h-4.5 2xl:w-4.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Jewelry Collections */}
            <div className="col-span-2 space-y-3 2xl:space-y-4">
              <h4 className="font-serif text-xs 2xl:text-sm font-bold uppercase tracking-[0.2em] text-[#DFC99B] border-b border-[#332A21] pb-1.5">
                Collections
              </h4>
              <ul className="space-y-2 2xl:space-y-2.5 font-sans text-xs 2xl:text-[14px] text-[#FAF6EE]/80">
                <li>
                  <a href="#categories" className="transition-colors hover:text-[#DFC99B]">
                    Anti-Tarnish Necklaces
                  </a>
                </li>
                <li>
                  <a href="#categories" className="transition-colors hover:text-[#DFC99B]">
                    Waterproof Bracelets &amp; Cuffs
                  </a>
                </li>
                <li>
                  <a href="#categories" className="transition-colors hover:text-[#DFC99B]">
                    Hypoallergenic Rings
                  </a>
                </li>
                <li>
                  <a href="#categories" className="transition-colors hover:text-[#DFC99B]">
                    Everyday &amp; Party Earrings
                  </a>
                </li>
                <li>
                  <a href="#categories" className="transition-colors hover:text-[#DFC99B]">
                    Royale Gold Watches
                  </a>
                </li>
                <li>
                  <a href="#categories" className="transition-colors hover:text-[#DFC99B]">
                    Festive &amp; Ethnic Sets
                  </a>
                </li>
                <li>
                  <a href="#bestsellers" className="transition-colors hover:text-[#DFC99B]">
                    Trending Royal Creations
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Bespoke Gifting Studio */}
            <div className="col-span-3 space-y-3 2xl:space-y-4">
              <h4 className="font-serif text-xs 2xl:text-sm font-bold uppercase tracking-[0.2em] text-[#DFC99B] border-b border-[#332A21] pb-1.5">
                Gifting Studio
              </h4>
              <ul className="space-y-2 2xl:space-y-2.5 font-sans text-xs 2xl:text-[14px] text-[#FAF6EE]/80">
                <li>
                  <a href="#gifting-studio" className="transition-colors hover:text-[#DFC99B]">
                    The Queen&apos;s Keepsake Hamper
                  </a>
                </li>
                <li>
                  <a href="#gifting-studio" className="transition-colors hover:text-[#DFC99B]">
                    Signature Jewelry Bouquets
                  </a>
                </li>
                <li>
                  <a href="#gifting-studio" className="transition-colors hover:text-[#DFC99B]">
                    Grand Celebration Combo
                  </a>
                </li>
                <li>
                  <a href="#gifting-studio" className="transition-colors hover:text-[#DFC99B]">
                    Bridal Shower &amp; Birthday Favors
                  </a>
                </li>
                <li>
                  <a href="#why-shiqueen" className="transition-colors hover:text-[#DFC99B]">
                    WhatsApp Video Preview Service
                  </a>
                </li>
                <li>
                  <a href="#why-shiqueen" className="transition-colors hover:text-[#DFC99B]">
                    18K Anti-Tarnish Lifetime Care
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact, Studio Address & Concierge */}
            <div className="col-span-3 space-y-3 2xl:space-y-4">
              <h4 className="font-serif text-xs 2xl:text-sm font-bold uppercase tracking-[0.2em] text-[#DFC99B] border-b border-[#332A21] pb-1.5">
                Concierge &amp; Studio
              </h4>

              <div className="space-y-2.5 2xl:space-y-3 font-sans text-xs 2xl:text-[14px] text-[#FAF6EE]/80">
                <div>
                  <p className="text-[10.5px] 2xl:text-xs font-bold uppercase tracking-wider text-[#DFC99B]">
                    Order &amp; Styling Support:
                  </p>
                  <a
                    href={SOCIAL_LINKS.whatsappUrl("Hi Shiqueen! I would like to place an order / speak with a stylist.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 2xl:px-3.5 2xl:py-2 text-xs 2xl:text-[13px] font-medium text-emerald-300 transition-all hover:bg-emerald-900/60 hover:text-white"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 2xl:h-4 2xl:w-4 text-emerald-400" />
                    <span>WhatsApp: +91 98765 43210</span>
                  </a>
                </div>

                <div>
                  <p className="text-[10.5px] 2xl:text-xs font-bold uppercase tracking-wider text-[#DFC99B]">
                    Community &amp; Unboxings:
                  </p>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block text-white hover:text-[#DFC99B] transition-colors"
                  >
                    Instagram: <span className="font-medium text-[#DFC99B]">{SOCIAL_LINKS.instagramHandle}</span>
                  </a>
                </div>

                <div>
                  <p className="text-[10.5px] 2xl:text-xs font-bold uppercase tracking-wider text-[#DFC99B]">
                    Atelier &amp; Fulfillment:
                  </p>
                  <p className="mt-0.5 leading-relaxed text-[#FAF6EE]/70">
                    Shiqueen Studio, Pan-India Express Delivery &amp; Nationwide Hub, Delivering to 19,000+ Pin Codes.
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] 2xl:text-xs font-bold uppercase tracking-wider text-[#DFC99B]">
                    Stylist Hours:
                  </p>
                  <p className="mt-0.5 text-[#FAF6EE]/70">
                    Mon – Sat: 10:00 AM – 8:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Trust & Assurance Strip (Desktop) */}
        <div className="border-t border-b border-[#332A21] bg-[#140F0C] py-4 2xl:py-5">
          <div className="mx-auto flex max-w-[1600px] 2xl:max-w-[1760px] flex-wrap items-center justify-between gap-4 px-10 xl:px-14 2xl:px-20 text-xs 2xl:text-sm text-[#DFC99B]">
            <div className="flex items-center gap-2">
              <span className="text-[#8C671A]">✦</span>
              <span className="text-white/90">Pan-India Insured Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8C671A]">✦</span>
              <span className="text-white/90">Personal Video Preview on WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8C671A]">✦</span>
              <span className="text-white/90">100% Waterproof &amp; Zero Green Skin Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8C671A]">✦</span>
              <span className="text-white/90">Secure UPI, Cards &amp; NetBanking Checkout</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links (Desktop) */}
        <div className="mx-auto max-w-[1600px] 2xl:max-w-[1760px] px-10 py-6 2xl:py-7 xl:px-14 2xl:px-20">
          <div className="flex items-center justify-between gap-3 text-[11.5px] 2xl:text-xs text-[#FAF6EE]/60">
            <p>
              &copy; 2026 <span className="font-serif font-bold text-white tracking-wider">SHIQUEEN</span>. Crafted For Every Queen. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <a href="#why-shiqueen" className="hover:text-[#DFC99B] transition-colors">
                Anti-Tarnish Warranty
              </a>
              <span className="text-[#332A21]">•</span>
              <a href="#why-shiqueen" className="hover:text-[#DFC99B] transition-colors">
                Care &amp; Cleaning Guide
              </a>
              <span className="text-[#332A21]">•</span>
              <a href="#gifting-studio" className="hover:text-[#DFC99B] transition-colors">
                Shipping &amp; Delivery Policy
              </a>
              <span className="text-[#332A21]">•</span>
              <a
                href={SOCIAL_LINKS.whatsappUrl("Hi Shiqueen! I need assistance with customer support.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}