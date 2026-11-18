import Image from "next/image";
import { Gift, MapPin, PackageCheck, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BENEFITS = [
  { icon: PackageCheck, text: "Track every order and its delivery" },
  { icon: MapPin, text: "Save addresses for faster checkout" },
  { icon: Star, text: "Review the pieces you love" },
  { icon: Gift, text: "Get early access to offers" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] pb-16 text-[#171717] lg:pb-0">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
        <div className="mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-[#E5DEC9] bg-white shadow-[0_24px_60px_-30px_rgba(60,40,10,0.35)] lg:grid-cols-[1fr_1.05fr]">
          {/* Brand panel (desktop) */}
          <aside className="relative hidden min-h-[640px] overflow-hidden lg:block">
            <Image
              src="/images/hero/hero-jewelry-desktop-v3.jpg"
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 540px, 0px"
              className="object-cover object-[70%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/90 via-[#1A1410]/40 to-[#1A1410]/5" />
            <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
              <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-[#F7DFC2]">Your Shiqueen account</p>
              <p className="mt-3 font-serif text-[40px] font-semibold leading-[1.1] text-white">
                Anti-tarnish jewellery, <span className="italic text-[#F7DFC2]">made to be lived in.</span>
              </p>
              <ul className="mt-7 space-y-3">
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-base text-white/90">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Icon className="h-[18px] w-[18px] text-[#F7DFC2]" aria-hidden="true" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="flex items-center justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="w-full max-w-[440px]">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
