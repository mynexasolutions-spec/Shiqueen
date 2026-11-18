"use client";

import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/brand-data";
import { WhatsAppIcon } from "@/components/Header";

const PROOF_CARDS = [
  {
    id: "waterproof",
    title: "100% Waterproof & Sweatproof",
    desc: "Wear 24/7 without taking it off. Impervious to hot showers, intense gym workouts, and saltwater.",
    tag: "✦ Zero Tarnish 24/7",
    image: "/images/proof/proof-waterproof.jpg",
  },
  {
    id: "green-skin",
    title: "Zero Green Skin Guaranteed",
    desc: "100% nickel-free and lead-free 316L surgical steel. Guaranteed to never turn skin green or cause rashes.",
    tag: "✦ Sensitive Skin Safe",
    image: "/images/proof/proof-hypoallergenic.jpg",
  },
  {
    id: "gold-pvd",
    title: "18K Gold Vacuum PVD Plating",
    desc: "Real 18K gold vapor-bonded deep into medical steel. 10x more durable against perfumes and body lotions.",
    tag: "✦ Perfume & Sweat Proof",
    image: "/images/proof/proof-pvd.jpg",
  },
  {
    id: "gifting",
    title: "WhatsApp Video Preview & Care",
    desc: "Every order is verified and previewed on video on WhatsApp before dispatch, packed in luxury keepsake boxes.",
    tag: "✦ Insured Express Delivery",
    image: "/images/proof/proof-gifting.jpg",
  },
] as const;

export default function AntiTarnishProof() {
  return (
    <section
      id="why-shiqueen"
      aria-label="Why Choose Shiqueen"
      className="border-b border-[#E5DEC9] bg-[#F7F3EB] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">
              The Shiqueen Standard
            </p>
            <span className="h-px w-8 bg-[#8C671A]" aria-hidden="true" />
          </div>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#231C16] sm:text-4xl lg:text-5xl">
            Waterproof. Sweatproof.{" "}
            <span className="italic text-[#8C671A]">Life-Proof.</span>
          </h2>
          <p className="mt-3 text-xs font-medium leading-relaxed text-[#231C16]/75 sm:text-sm lg:text-base xl:font-semibold xl:text-[#231C16]/85">
            Say goodbye to faded black jewelry and green skin stains. Engineered with medical-grade 316L stainless steel &amp; 18K gold vacuum PVD molecular bonding.
          </p>
        </div>

        {/* Visual Lifestyle Proof Cards (Idea 1: Photo-backed Editorial Luxury Tiles) */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_CARDS.map((card) => (
            <div
              key={card.id}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl border border-[#DFC99B] bg-[#231C16] p-6 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[#8C671A] hover:shadow-2xl sm:aspect-[4/5] sm:p-7"
            >
              {/* Background Lifestyle Image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Luxury Vignette Gradient Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/55 to-transparent transition-all duration-500 group-hover:via-[#1A1410]/45"
                aria-hidden="true"
              />

              {/* Bottom: Typography & Guarantee */}
              <div className="relative z-10">
                <h3 className="font-serif text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#F7DFC2] sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white/85 sm:text-[12.5px]">
                  {card.desc}
                </p>

                <div className="mt-4 border-t border-white/20 pt-3">
                  <span className="font-sans text-[11px] font-semibold text-[#F7DFC2] tracking-wide">
                    {card.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stylist Consultation Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#DFC99B] bg-white p-5 sm:px-8 shadow-xs">
          <div>
            <p className="font-sans text-xs font-bold text-[#231C16] xl:text-sm">
              Have questions about sizing, anti-tarnish warranty, or delivery dates?
            </p>
            <p className="mt-0.5 font-sans text-[11px] font-medium text-[#231C16]/70 xl:text-xs xl:font-semibold xl:text-[#231C16]/82">
              Our personal stylists are available 1-on-1 on WhatsApp to guide you.
            </p>
          </div>
          <a
            href={SOCIAL_LINKS.whatsappUrl(
              "Hi Shiqueen! I have a question regarding your 18K anti-tarnish warranty, jewelry sizing, and delivery."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#8C671A] hover:bg-[#735312] px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#F7DFC2]" />
            <span>Ask a Stylist on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
