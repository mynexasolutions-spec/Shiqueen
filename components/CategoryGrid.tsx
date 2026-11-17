"use client";

import Image from "next/image";
import Link from "next/link";
import { VISUAL_CATEGORIES } from "@/lib/brand-data";

export default function CategoryGrid() {
  return (
    <section
      id="categories"
      aria-label="Shop by Category"
      className="border-b border-[#E5DEC9] bg-[#FAF7F2] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">
              Explore Collections
            </p>
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
          </div>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl lg:text-5xl">
            Shop By <span className="italic text-[#8C671A]">Category</span>
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-[#171717]/70 sm:text-sm">
            Discover waterproof 18K gold-plated anti-tarnish jewelry, heirloom festive sets, and bespoke luxury gifting creations.
          </p>
        </div>

        {/* 8-Item Visual Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:gap-8">
          {VISUAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.id}`}
              className="group relative flex flex-col items-center text-center focus:outline-hidden"
            >
              {/* Image Container with Gold Ring & Hover Elevation */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E5DEC9] bg-[#EFE8DD] shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C59B27] group-hover:shadow-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                />

                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Optional Badge (Hidden on mobile for clean cards, visible on sm+) */}
                {cat.badge && (
                  <span className="hidden sm:inline-block absolute left-2.5 top-2.5 rounded-full border border-white/40 bg-white/90 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#171717] shadow-xs backdrop-blur-xs sm:text-[10px]">
                    {cat.badge}
                  </span>
                )}

                {/* Hover CTA Pill */}
                <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block rounded-full bg-[#171717] py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-white shadow-md transition-colors group-hover:bg-[#8C671A]">
                    View Pieces →
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="mt-3.5 sm:mt-4">
                <h3 className="font-serif text-base font-semibold text-[#171717] transition-colors duration-200 group-hover:text-[#8C671A] sm:text-lg">
                  {cat.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-[#171717]/60 sm:text-xs">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
