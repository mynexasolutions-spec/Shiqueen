"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANNOUNCEMENTS,
  BRAND,
  CORE_SERVICES,
  SOCIAL_LINKS,
  type AnnouncementItem,
} from "@/lib/brand-data";
import { useCart } from "@/context/CartContext";

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

function TruckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function SparklesIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 3v4M21 5h-4" />
    </svg>
  );
}

function GiftIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function WatchIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="6" />
      <polyline points="12 10 12 12 13 13" />
      <path d="M16.13 7.66l-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
      <path d="M7.88 16.36l.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
    </svg>
  );
}

function AnnouncementIcon({ icon }: { icon: AnnouncementItem["icon"] }) {
  const iconClass = "h-3.5 w-3.5 2xl:h-4 2xl:w-4 shrink-0 text-[#6E4F10]";
  if (icon === "gift") return <GiftIcon className={iconClass} />;
  if (icon === "truck") return <TruckIcon className={iconClass} />;
  if (icon === "watch") return <WatchIcon className={iconClass} />;
  return <SparklesIcon className={iconClass} />;
}

const ANTI_TARNISH_SUBCATEGORIES = [
  { name: "Necklaces", note: "Layered & Dainty Chains", href: "/collections/necklaces" },
  { name: "Earrings", note: "Hoops, Studs & Drops", href: "/collections/earrings" },
  { name: "Bracelets", note: "Cuffs, Tennis & Chains", href: "/collections/bracelets" },
  { name: "Rings", note: "Stackable & Statement", href: "/collections/rings" },
  { name: "Anti-Tarnish Watch", note: "18K Gold-Toned Timepieces", href: "/collections/watches" },
];

const DIRECT_NAV_LINKS: Array<{
  label: string;
  widescreenPrefix?: string;
  href: string;
}> = [
  {
    label: "Watches",
    widescreenPrefix: "Anti-Tarnish ",
    href: "/collections/watches",
  },
  { label: "Festive Sets", href: "/collections/festive" },
  { label: "Custom Hampers", href: "/collections/hampers" },
  { label: "Jewelry Bouquets", href: "/collections/bouquets" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openDrawer, totalItems } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 1. Sleek Continuous Marquee Reel / Announcement Ticker */}
      <div className="relative overflow-hidden border-b border-[#DED1C9] bg-[#E9E0DB] py-2 text-[#171717]">
        <div className="flex w-max animate-marquee items-center select-none">
          {/* Duplicated for seamless 100% to -50% infinite loop */}
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-2 whitespace-nowrap px-6"
            >
              <AnnouncementIcon icon={item.icon} />
              <span className="text-[11px] font-medium tracking-wide text-[#171717] sm:text-xs xl:text-[13px] 2xl:text-sm">
                {item.text}
              </span>
              <span
                className="ml-6 font-serif text-xs text-[#8C671A]/70 select-none"
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sticky Main Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-[#DFC99B] bg-[#FAF6EE]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-6 xl:px-8 2xl:px-20">
          {/* Brand Logo Lockup (Left on mobile, left on desktop) */}
          <Link
            href="/"
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Shiqueen Home"
          >
            <div
              style={{ position: "relative" }}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#DFC99B] bg-[#FAF6EE] p-0.5 shadow-xs transition-transform duration-300 group-hover:scale-[1.03] sm:h-18 sm:w-18"
            >
              <Image
                src={BRAND.logoPath}
                alt="Shiqueen Crown Logo"
                fill
                sizes="72px"
                className="rounded-[10px] object-cover"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-[0.14em] text-[#171717] whitespace-nowrap sm:text-xl 2xl:text-[26px]">
                {BRAND.name}
              </span>
              <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#8C671A] whitespace-nowrap sm:text-[9px] 2xl:text-xs 2xl:tracking-[0.2em] 2xl:font-bold 2xl:text-[#6E4F10]">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Equally Spaced + Smart Widescreen Font Scaling) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden flex-1 items-center justify-evenly pl-4 lg:flex xl:pl-6 2xl:pl-16"
          >
            {/* Hover / Focus Dropdown for Anti-Tarnish Jewelry */}
            <div className="group relative py-2">
              <a
                href="#categories"
                className="inline-flex items-center gap-1 whitespace-nowrap text-[13.5px] font-medium tracking-wide text-[#171717] transition-colors hover:text-[#8C671A] xl:text-[14px] 2xl:text-[17px] 2xl:font-semibold 2xl:text-[#111111]"
              >
                <span>Anti-Tarnish Jewelry</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-[#8C671A] transition-transform duration-200 group-hover:rotate-180"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <div className="pointer-events-none invisible absolute left-0 top-full z-50 w-72 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-2xl border border-[#E5DEC9] bg-white p-3 shadow-xl">
                  <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">
                    Waterproof Everyday Demi-Fine
                  </p>
                  <ul className="space-y-1">
                    {ANTI_TARNISH_SUBCATEGORIES.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-[#FAF6EE]"
                        >
                          <span className="font-medium text-[#171717]">
                            {sub.name}
                          </span>
                          <span className="text-[11px] text-[#171717]/60">
                            {sub.note}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {DIRECT_NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative whitespace-nowrap py-2 text-[13.5px] font-medium tracking-wide text-[#171717] transition-colors hover:text-[#8C671A] xl:text-[14px] 2xl:text-[17px] 2xl:font-semibold 2xl:text-[#111111] after:absolute after:bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#C59B27] after:transition-all after:duration-200 hover:after:w-full"
              >
                {item.widescreenPrefix && (
                  <span className="hidden 2xl:inline">
                    {item.widescreenPrefix}
                  </span>
                )}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions: Desktop Cart Drawer Trigger (lg+) + Mobile Menu Trigger (<lg) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open shopping bag (${totalItems} items)`}
              className="relative hidden h-10 items-center gap-2 rounded-full border border-[#E5DEC9] bg-white px-4 text-xs font-semibold text-[#171717] shadow-xs transition hover:border-[#C59B27] active:scale-95 lg:inline-flex xl:text-[13px]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-[#8C671A]"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Bag</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#171717] px-1.5 text-[10px] font-bold text-[#FAF6EE]">
                {totalItems}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#171717] shadow-xs transition hover:border-[#C59B27] active:scale-95 lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="7" y2="7" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="15" y1="17" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 4. Mobile Luxury Slide-Over Drawer (Opens from Right) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-[#FAF6EE] shadow-2xl ml-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#E5DEC9] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-[#DFC99B] bg-[#FAF6EE]">
                  <Image
                    src={BRAND.logoPath}
                    alt="Shiqueen Logo"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold tracking-[0.14em] text-[#171717]">
                    {BRAND.name}
                  </p>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8C671A]">
                    {BRAND.tagline}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DEC9] bg-white text-[#171717]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Categories, Bag Card & Subcategories */}
            <div className="flex-1 space-y-6 px-5 py-5">
              {/* Top Royal Bag Quick Card Inside Side Menu */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDrawer();
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-[#DFC99B] bg-white p-3.5 text-left shadow-xs transition hover:border-[#8C671A]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF6EE] text-[#8C671A] border border-[#E5DEC9]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                      Your Royal Bag
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#171717]/70">
                      {totalItems > 0
                        ? `${totalItems} item${totalItems > 1 ? "s" : ""} ready for checkout`
                        : "Free Pan-India Express Shipping"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#171717] px-2 text-[11px] font-bold text-[#FAF6EE]">
                    {totalItems}
                  </span>
                </div>
              </button>

              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">
                  Anti-Tarnish Jewelry
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ANTI_TARNISH_SUBCATEGORIES.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-[#E5DEC9] bg-white px-3 py-2.5 text-xs font-medium text-[#171717] transition hover:border-[#C59B27]"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">
                  Signature Collections &amp; Gifting
                </p>
                <div className="space-y-2">
                  {DIRECT_NAV_LINKS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#E5DEC9] bg-white px-4 py-3 text-sm font-medium text-[#171717]"
                    >
                      <span>
                        {item.widescreenPrefix
                          ? `${item.widescreenPrefix}${item.label}`
                          : item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3 Core Services */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-[#F3ECE0] p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">
                  Our Services
                </p>
                <ul className="space-y-2.5">
                  {CORE_SERVICES.map((service) => (
                    <li key={service.id} className="text-xs">
                      <p className="font-semibold text-[#171717]">
                        <span className="text-[#8C671A]" aria-hidden="true">
                          ✦{" "}
                        </span>
                        {service.title}
                      </p>
                      <p className="mt-0.5 text-[#171717]/70">
                        {service.badge}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Drawer Footer Social & WhatsApp */}
            <div className="space-y-3 border-t border-[#E5DEC9] bg-white px-5 py-4">
              <a
                href={SOCIAL_LINKS.whatsappUrl(
                  "Hi Shiqueen! I would like to order or customize a gift hamper/jewelry."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Order &amp; Customize on WhatsApp
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#E5DEC9] bg-[#FAF6EE] py-2.5 text-xs font-medium text-[#171717]"
                >
                  <InstagramIcon className="h-4 w-4 text-[#8C671A]" />
                  {SOCIAL_LINKS.instagramHandle}
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#E5DEC9] bg-[#FAF6EE] py-2.5 text-xs font-medium text-[#171717]"
                >
                  <FacebookIcon className="h-4 w-4 text-[#8C671A]" />
                  Facebook
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 5. Mobile Lower Sticky Luxury Navbar (Bottom Tab Bar) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DFC99B]/70 bg-[#FAF6EE]/92 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden"
      >
        <div className="mx-auto grid h-14 max-w-md grid-cols-5 items-center px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-[#171717] transition hover:text-[#8C671A] active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
            </svg>
            <span className="text-[9px] font-semibold tracking-wider uppercase">Home</span>
          </Link>

          {/* 2. Jewelry Categories */}
          <a
            href="#categories"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-[#171717] transition hover:text-[#8C671A] active:scale-95"
          >
            <SparklesIcon className="h-5 w-5 text-[#8C671A]" />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Jewelry</span>
          </a>

          {/* 3. Gifting Studio */}
          <a
            href="#gifting-studio"
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-[#171717] transition hover:text-[#8C671A] active:scale-95"
          >
            <GiftIcon className="h-5 w-5 text-[#8C671A]" />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Gifting</span>
          </a>

          {/* 4. Royal Bag Drawer Trigger */}
          <button
            type="button"
            onClick={openDrawer}
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-[#171717] transition hover:text-[#8C671A] active:scale-95"
            aria-label={`Open shopping bag (${totalItems} items)`}
          >
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-[#8C671A]"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[8.5px] font-bold text-[#FAF6EE] ring-2 ring-[#FAF6EE]">
                {totalItems}
              </span>
            </div>
            <span className="text-[9px] font-semibold tracking-wider uppercase">Bag</span>
          </button>

          {/* 5. Menu Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 text-[#171717] transition hover:text-[#8C671A] active:scale-95"
            aria-label="Open menu drawer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="7" y2="7" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="16" y1="17" y2="17" />
            </svg>
            <span className="text-[9px] font-semibold tracking-wider uppercase">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
