"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSite, useWhatsApp } from "@/components/site/SiteProvider";

type AnnouncementItem = { icon: string; text: string };

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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openDrawer, totalItems } = useCart();
  const { openDrawer: openWishlistDrawer, totalItems: wishlistCount } = useWishlist();
  const { content } = useSite();
  const whatsapp = useWhatsApp();
  const BRAND = content.brand;
  const nav = content.navigation;
  const ANNOUNCEMENTS = content.announcements.items;
  const ANTI_TARNISH_SUBCATEGORIES = nav.dropdown_items;
  const DIRECT_NAV_LINKS = nav.links;

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
              key={idx}
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
        <div className="mx-auto flex max-w-[1760px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-6 xl:px-8 2xl:px-12">
          {/* Brand Logo Lockup (Left on mobile, left on desktop) */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 focus:outline-none"
            aria-label="Shiqueen Home"
          >
            <div
              style={{ position: "relative" }}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#DFC99B] bg-[#FAF6EE] p-0.5 shadow-xs transition-transform duration-300 group-hover:scale-[1.03] sm:h-18 sm:w-18"
            >
              <Image
                src={BRAND.logo}
                alt="Shiqueen Crown Logo"
                fill
                sizes="72px"
                className="rounded-[10px] object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-[0.14em] text-[#171717] whitespace-nowrap sm:text-xl 2xl:text-2xl">
                {BRAND.name}
              </span>
              <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#8C671A] whitespace-nowrap sm:text-[9px] 2xl:text-[10.5px] 2xl:tracking-[0.18em] 2xl:font-bold 2xl:text-[#6E4F10]">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Guaranteed Minimum Gap + Even Distribution across all screen widths) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden flex-1 items-center justify-evenly gap-4 px-2 lg:flex xl:gap-6 2xl:gap-8"
          >
            {/* Hover / Focus Dropdown for Anti-Tarnish Jewelry */}
            <div className="group relative py-2">
              <a
                href="#categories"
                className="inline-flex items-center gap-1 whitespace-nowrap text-[13.5px] font-medium tracking-wide text-[#171717] transition-colors hover:text-[#8C671A] xl:text-[14px] 2xl:text-[15px] 2xl:font-semibold 2xl:text-[#111111]"
              >
                <span>{nav.dropdown_label}</span>
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
                    {nav.dropdown_heading}
                  </p>
                  <ul className="space-y-1">
                    {ANTI_TARNISH_SUBCATEGORIES.map((sub) => (
                      <li key={`${sub.label}-${sub.href}`}>
                        <Link
                          href={sub.href}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-[#FAF6EE]"
                        >
                          <span className="font-medium text-[#171717]">
                            {sub.label}
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
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="relative whitespace-nowrap py-2 text-[13.5px] font-medium tracking-wide text-[#171717] transition-colors hover:text-[#8C671A] xl:text-[14px] 2xl:text-[15px] 2xl:font-semibold 2xl:text-[#111111] after:absolute after:bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#C59B27] after:transition-all after:duration-200 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions: Minimal Luxury Icons (Wishlist, Account, Bag, Mobile Menu) */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={openWishlistDrawer}
              title="Wishlist"
              aria-label={`Open wishlist (${wishlistCount} items)`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-[#EFE8DC]/70 hover:text-[#8C671A] active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill={wishlistCount > 0 ? "#B58924" : "none"}
                stroke={wishlistCount > 0 ? "#B58924" : "currentColor"}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[21px] w-[21px]"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] font-bold text-[#FAF6EE] ring-2 ring-[#FAF6EE]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <Link
              href="/account"
              title="Account"
              aria-label="My account"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-[#EFE8DC]/70 hover:text-[#8C671A] active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[21px] w-[21px]"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              title="Shopping Bag"
              aria-label={`Open shopping bag (${totalItems} items)`}
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-[#171717] transition hover:bg-[#EFE8DC]/70 hover:text-[#8C671A] active:scale-95 lg:inline-flex"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[21px] w-[21px]"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] font-bold text-[#FAF6EE] ring-2 ring-[#FAF6EE]">
                  {totalItems}
                </span>
              )}
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
                    src={BRAND.logo}
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
                        : content.cart.drawer_promo}
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
                  {nav.dropdown_label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ANTI_TARNISH_SUBCATEGORIES.map((sub) => (
                    <Link
                      key={`${sub.label}-${sub.href}`}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-[#E5DEC9] bg-white px-3 py-2.5 text-xs font-medium text-[#171717] transition hover:border-[#C59B27]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">
                  {nav.mobile_links_heading}
                </p>
                <div className="space-y-2">
                  {DIRECT_NAV_LINKS.map((item) => (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-[#E5DEC9] bg-white px-4 py-3 text-sm font-medium text-[#171717]"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3 Core Services */}
              <div className="rounded-2xl border border-[#E5DEC9] bg-[#F3ECE0] p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">
                  {nav.services_heading}
                </p>
                <ul className="space-y-2.5">
                  {nav.services.map((service, i) => (
                    <li key={i} className="text-xs">
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
                href={whatsapp(nav.whatsapp_message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {nav.whatsapp_cta}
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={BRAND.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#E5DEC9] bg-[#FAF6EE] py-2.5 text-xs font-medium text-[#171717]"
                >
                  <InstagramIcon className="h-4 w-4 text-[#8C671A]" />
                  {BRAND.instagram_handle}
                </a>
                <a
                  href={BRAND.facebook_url}
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
