"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_SLIDES, type HeroSlide } from "@/lib/brand-data";

function renderTitleWithHighlight(
  title: string,
  highlightWord: string,
  variant: "desktop" | "mobile"
) {
  const index = title.indexOf(highlightWord);
  if (index === -1) return title;

  const before = title.slice(0, index);
  const after = title.slice(index + highlightWord.length);

  return (
    <>
      {before}
      <span
        className={
          variant === "desktop"
            ? "italic font-semibold text-[#A9781E] underline decoration-[#C59B27]/70 decoration-2 underline-offset-[10px]"
            : "italic font-semibold text-[#8C671A] underline decoration-[#C59B27]/80 decoration-2 underline-offset-4"
        }
      >
        {highlightWord}
      </span>
      {after}
    </>
  );
}

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const activeSlide: HeroSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-label="Shiqueen Featured Collections"
      style={{ backgroundColor: activeSlide.bgColor }}
      className="relative w-full overflow-hidden border-b border-[#E5DEC9] transition-colors duration-700 ease-out"
    >
      {/* ==================== DESKTOP SEAMLESS EDGE-TO-EDGE HERO ==================== */}
      <div
        style={{ backgroundColor: activeSlide.bgColor }}
        className="relative hidden h-[calc(100vh-127px)] min-h-[500px] w-full overflow-hidden transition-colors duration-700 ease-out md:block"
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              style={{ backgroundColor: slide.bgColor }}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0"
              }`}
            >
              {/* Right-Anchored Exact 16:9 Image Stage (0% Crop) */}
              <div className="relative ml-auto h-full aspect-[16/9]">
                <Image
                  src={slide.desktopImage}
                  alt={slide.imageAlt}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 768px) 85vw, 100vw"
                  className="object-contain object-right"
                />
                {/* Seamless Left-Edge Studio Blend matched to each slide's exact left-edge RGB */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-[24%]"
                  style={{
                    background: `linear-gradient(to right, ${slide.bgColor} 0%, ${slide.bgColor}D9 45%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Minimal Luxury Campaign Copy (Left Side) */}
        <div className="relative z-20 mx-auto flex h-full w-full max-w-[1760px] items-center px-6 sm:px-10 lg:px-14 xl:px-20 2xl:px-24">
          <div className="max-w-[440px] lg:max-w-[500px] xl:max-w-[580px] 2xl:max-w-[640px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#8C671A]" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6E4F10] xl:text-xs">
                {activeSlide.eyebrow}
              </span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.18] tracking-tight text-[#111111] lg:text-4xl xl:text-5xl 2xl:text-[3.5rem]">
              {renderTitleWithHighlight(
                activeSlide.title,
                activeSlide.highlightWord,
                "desktop"
              )}
            </h1>

            <p className="mt-4 max-w-[460px] text-xs font-medium leading-[1.7] text-[#111111]/85 lg:text-sm xl:max-w-[520px] xl:text-base xl:font-semibold xl:text-[#111111]">
              {activeSlide.description}
            </p>

            {/* Primary CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={activeSlide.primaryCta.href}
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#8C671A] xl:px-7 xl:py-3.5 xl:text-xs"
              >
                <span>{activeSlide.primaryCta.label}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Slide Indicator: dash lines (bottom-center) */}
        <div className="absolute inset-x-0 bottom-5 z-30 flex items-center justify-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={`${slide.id}-dash`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === activeIndex}
              className="group flex h-4 items-center"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-12 bg-[#111111]"
                    : "w-7 bg-[#111111]/35 group-hover:bg-[#111111]/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ==================== MOBILE HERO (9:16) ==================== */}
      <div className="relative block aspect-[9/16] max-h-[85vh] w-full overflow-hidden md:hidden">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={`${slide.id}-mobile`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={slide.mobileImage}
                alt={slide.imageAlt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          );
        })}

        {/* Mobile Top Content & Glassmorphism CTA (In the empty upper space of the image) */}
        <div className="relative z-20 flex flex-col items-center px-4 pt-4 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-5 bg-[#8C671A]/70" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E4F10]">
              {activeSlide.eyebrow}
            </span>
            <span className="h-px w-5 bg-[#8C671A]/70" aria-hidden="true" />
          </div>

          <h1 className="mt-1.5 max-w-[340px] font-serif text-[20px] font-bold leading-[1.2] tracking-tight text-[#111111] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
            {renderTitleWithHighlight(
              activeSlide.title,
              activeSlide.highlightWord,
              "mobile"
            )}
          </h1>

          {/* Compact Frosted Glass CTA Button */}
          <div className="mt-2.5">
            <a
              href={activeSlide.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-200 hover:bg-white active:scale-95"
            >
              <span>{activeSlide.primaryCta.label}</span>
            </a>
          </div>
        </div>

        {/* Mobile Floating Glassmorphic Dots (...) */}
        <div className="absolute inset-x-0 bottom-3.5 z-30 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/25 px-2.5 py-1.5 shadow-md backdrop-blur-md">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`${slide.id}-mobile-dot`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={isActive}
                  className="group flex h-3 items-center justify-center p-0.5"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        : "w-1.5 bg-white/45 group-hover:bg-white/75"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
