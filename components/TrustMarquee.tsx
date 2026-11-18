"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSite } from "@/components/site/SiteProvider";
import { splitHighlight } from "@/lib/site-types";

export default function TrustMarquee() {
  const { content, featuredReviews: REVIEWS } = useSite();
  const home = content.home;
  const [before, highlight, after] = splitHighlight(home.reviews_title, home.reviews_highlight);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Calculate card stride width dynamically
  const getCardStride = () => {
    if (!scrollRef.current) return 380;
    const card = scrollRef.current.firstElementChild as HTMLElement;
    if (!card) return 380;
    const style = window.getComputedStyle(scrollRef.current);
    const gap = parseFloat(style.columnGap || style.gap || "16") || 16;
    return card.offsetWidth + gap;
  };

  // Smooth scroll 1 card at a time
  const scrollOneCard = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const stride = getCardStride();
    const currentScroll = scrollRef.current.scrollLeft;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

    if (direction === "right") {
      if (currentScroll >= maxScroll - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: stride, behavior: "smooth" });
      }
    } else {
      if (currentScroll <= 10) {
        scrollRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: -stride, behavior: "smooth" });
      }
    }
  };

  // Jump directly to a card index via dot click
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const stride = getCardStride();
    scrollRef.current.scrollTo({ left: index * stride, behavior: "smooth" });
  };

  // Track active card on scroll for dot indicators
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const stride = getCardStride();
    const scrollLeft = scrollRef.current.scrollLeft;
    const index = Math.round(scrollLeft / stride);
    setActiveIndex(Math.min(Math.max(index, 0), REVIEWS.length - 1));
  };

  // Auto-scroll 1 card every 5 seconds (pauses on hover/touch)
  useEffect(() => {
    if (isPaused || REVIEWS.length < 2) return;
    const timer = setInterval(() => {
      scrollOneCard("right");
    }, 5500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, REVIEWS.length]);

  return (
    <>
      {/* 1. Verified Customer Reviews (featured in Admin → Reviews) */}
      {REVIEWS.length > 0 && (
      <section
        id="reviews"
        aria-label="Customer Reviews & Testimonials"
        className="border-b border-[#E5DEC9] bg-[#FAF7F2] py-14 sm:py-18 lg:py-20"
      >
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
          {/* Header & Controls in one balanced row */}
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">
                  {home.reviews_eyebrow}
                </p>
                <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
              </div>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#231C16] sm:text-4xl">
                {before}
                {highlight && <span className="italic text-[#8C671A]">{highlight}</span>}
                {after}
              </h2>
              <p className="mt-1.5 text-xs font-medium text-[#231C16]/75 sm:text-sm xl:text-[15px] xl:font-semibold xl:text-[#231C16]/85">
                {home.reviews_text}
              </p>
            </div>

            {/* Desktop Navigation Arrows (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => scrollOneCard("left")}
                aria-label="Previous Review"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DFC99B] bg-white text-[#231C16] shadow-xs transition-all hover:bg-[#8C671A] hover:text-white hover:border-[#8C671A] active:scale-95 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollOneCard("right")}
                aria-label="Next Review"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DFC99B] bg-white text-[#231C16] shadow-xs transition-all hover:bg-[#8C671A] hover:text-white hover:border-[#8C671A] active:scale-95 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 1-by-1 Card Scroll Track (Clean Full-Width Card on Mobile, Native Touch Swipe & Auto-Scroll) */}
          <div className="mt-6 sm:mt-8">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start flex flex-col justify-between rounded-3xl border border-[#DFC99B] bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#8C671A] hover:shadow-md sm:p-7"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                        <span aria-label={`${rev.rating} out of 5 stars`}>
                          {"★".repeat(rev.rating)}
                          <span className="text-amber-500/30">{"★".repeat(5 - rev.rating)}</span>
                        </span>
                      </div>
                      {rev.verified && (
                        <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-sans text-[10px] font-bold text-emerald-700">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>

                    <p className="mt-4 font-sans text-xs font-medium italic leading-relaxed text-[#231C16]/80 sm:text-[13px] xl:font-semibold xl:text-[#231C16]/90 2xl:text-sm">
                      &ldquo;{rev.body}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#F0EAE0] pt-4">
                    <p className="font-sans text-xs 2xl:text-sm font-bold text-[#231C16]">
                      {rev.author}{" "}
                      {rev.location && (
                        <span className="font-medium text-[#231C16]/65 xl:font-semibold xl:text-[#231C16]/75">• {rev.location}</span>
                      )}
                    </p>
                    <Link
                      href={`/products/${rev.product_slug}`}
                      className="mt-0.5 block font-sans text-[10.5px] 2xl:text-xs font-semibold text-[#8C671A] line-clamp-1 hover:underline"
                    >
                      Purchased: {rev.product_name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clean Card Indicators (1 dot per review, clickable) */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Jump to review ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i
                    ? "w-7 bg-[#8C671A]"
                    : "w-2 bg-[#DFC99B]/60 hover:bg-[#8C671A]/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Infinite Royal Gold Ticker Ribbon */}
      {home.ticker_items.length > 0 && (
      <aside
        aria-label="Brand Highlights Ticker"
        className="overflow-hidden border-b border-[#E5DEC9] bg-[#8C671A] py-3 text-white"
      >
        <div className="flex whitespace-nowrap text-xs font-bold tracking-[0.25em] uppercase">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 animate-marquee items-center gap-8 px-4" aria-hidden={copy === 1}>
              {home.ticker_items.map((t, i) => (
                <span key={i}>✦ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </aside>
      )}
    </>
  );
}
