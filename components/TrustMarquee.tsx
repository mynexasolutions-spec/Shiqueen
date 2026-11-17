"use client";

import { useRef, useState, useEffect } from "react";

const REVIEWS = [
  {
    id: "review-1",
    author: "Ananya Sharma",
    location: "Mumbai",
    verified: true,
    rating: 5,
    product: "Aura Triple Layered Bar Necklace",
    quote:
      "I've worn this necklace continuously for 8 months—daily hot showers, sweaty gym sessions, and even a Goa beach trip. Still shines like solid gold. Never taking it off!",
  },
  {
    id: "review-2",
    author: "Riya Malhotra",
    location: "New Delhi",
    verified: true,
    rating: 5,
    product: "The Queen's Luxury Keepsake Hamper",
    quote:
      "The customized gift hamper for my sister's birthday was pure magic! The warm fairy lights, gold watch, and handwritten letter made her tear up with joy. Best gifting experience ever!",
  },
  {
    id: "review-3",
    author: "Tanvi Kulkarni",
    location: "Bengaluru",
    verified: true,
    rating: 5,
    product: "Eternal Paperclip Chain & Cuff Duo",
    quote:
      "Zero green skin is real! I have hyper-sensitive skin and usually get rashes from artificial jewelry, but Shiqueen's 316L medical steel is truly hypoallergenic. So lightweight and luxury!",
  },
  {
    id: "review-4",
    author: "Sneha Patel",
    location: "Pune",
    verified: true,
    rating: 5,
    product: "Signature Jewelry Bouquet",
    quote:
      "The jewelry bouquet was the biggest viral hit at my best friend's bridal shower! The preserved blooms and gold necklace are so gorgeous together. The video preview on WhatsApp gave total peace of mind.",
  },
  {
    id: "review-5",
    author: "Meera Iyer",
    location: "Chennai",
    verified: true,
    rating: 5,
    product: "Royale Jubilee Gold Watch",
    quote:
      "This watch looks like a ₹35,000 heirloom timepiece. I wear it to office and dinners, and everyone asks where I got it. Waterproof feature is a lifesaver in daily hand washing!",
  },
  {
    id: "review-6",
    author: "Pooja Verma",
    location: "Jaipur",
    verified: true,
    rating: 5,
    product: "Starlight Triple Stacking Ring Trio",
    quote:
      "Rings didn't fade even with constant soap and alcohol sanitizer contact throughout the day. Premium 18K gold gleam that doesn't chip. 10/10 recommend to all Queens!",
  },
] as const;

export default function TrustMarquee() {
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
    if (isPaused) return;
    const timer = setInterval(() => {
      scrollOneCard("right");
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <>
      {/* 1. Verified Customer Reviews: 1-by-1 Smooth Card Carousel */}
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
                  The Queen Squad
                </p>
                <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
              </div>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#231C16] sm:text-4xl">
                Loved by 10,000+ Queens{" "}
                <span className="italic text-[#8C671A]">Across India</span>
              </h2>
              <p className="mt-1.5 text-xs text-[#231C16]/75 sm:text-sm">
                Real stories from verified buyers wearing Shiqueen waterproof jewelry 24/7.
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
                        ★★★★★
                      </div>
                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-sans text-[10px] font-bold text-emerald-700">
                        ✓ Verified Queen
                      </span>
                    </div>

                    <p className="mt-4 font-sans text-xs italic leading-relaxed text-[#231C16]/85 sm:text-[13px] 2xl:text-sm">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#F0EAE0] pt-4">
                    <p className="font-sans text-xs 2xl:text-sm font-bold text-[#231C16]">
                      {rev.author}{" "}
                      <span className="font-normal text-[#888888]">• {rev.location}</span>
                    </p>
                    <p className="mt-0.5 font-sans text-[10.5px] 2xl:text-xs font-medium text-[#8C671A] line-clamp-1">
                      Purchased: {rev.product}
                    </p>
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

      {/* Infinite Royal Gold Ticker Ribbon */}
      <aside
        aria-label="Brand Highlights Ticker"
        className="overflow-hidden border-b border-[#E5DEC9] bg-[#8C671A] py-3 text-white"
      >
        <div className="flex whitespace-nowrap text-xs font-bold tracking-[0.25em] uppercase">
          <div className="flex shrink-0 animate-marquee items-center gap-8 px-4">
            <span>✦ 100% WATERPROOF &amp; SWEATPROOF JEWELRY</span>
            <span>✦ 18K GOLD VACUUM PVD PLATING</span>
            <span>✦ ZERO GREEN SKIN &amp; HYPOALLERGENIC</span>
            <span>✦ HANDCRAFTED CUSTOM GIFT HAMPERS</span>
            <span>✦ EVERLASTING JEWELRY BOUQUETS</span>
            <span>✦ PAN-INDIA INSURED SHIPPING</span>
            <span>✦ 1-ON-1 WHATSAPP CONCIERGE CARE</span>
          </div>
          <div className="flex shrink-0 animate-marquee items-center gap-8 px-4" aria-hidden="true">
            <span>✦ 100% WATERPROOF &amp; SWEATPROOF JEWELRY</span>
            <span>✦ 18K GOLD VACUUM PVD PLATING</span>
            <span>✦ ZERO GREEN SKIN &amp; HYPOALLERGENIC</span>
            <span>✦ HANDCRAFTED CUSTOM GIFT HAMPERS</span>
            <span>✦ EVERLASTING JEWELRY BOUQUETS</span>
            <span>✦ PAN-INDIA INSURED SHIPPING</span>
            <span>✦ 1-ON-1 WHATSAPP CONCIERGE CARE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
