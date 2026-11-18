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
          <p className="mt-3 text-xs font-medium leading-relaxed text-[#171717]/75 sm:text-sm xl:text-[15px] xl:font-semibold xl:text-[#171717]/85 2xl:text-base">
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
              {/* Clean Edge-to-Edge Image Container with Gold Ring & Hover Elevation */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E5DEC9] bg-[#EFE8DD] shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C59B27] group-hover:shadow-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Title & Tagline */}
              <div className="mt-3.5 sm:mt-4">
                <h3 className="font-serif text-base font-semibold text-[#171717] transition-colors duration-200 group-hover:text-[#8C671A] sm:text-lg xl:text-xl">
                  {cat.name}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-[#171717]/70 sm:text-xs xl:text-[13px] xl:font-semibold xl:text-[#171717]/82">
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
