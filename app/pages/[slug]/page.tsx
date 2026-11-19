import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header, { WhatsAppIcon } from "@/components/Header";
import Footer from "@/components/Footer";
import RichText from "@/components/site/RichText";
import { getPublishedPage, getPublishedPageSlugs } from "@/lib/server/pages";

// Information pages are static (cached) and refreshed when edited in Admin → Pages.
export const ensureStatic = "navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const POLICY_TABS = [
  { slug: "care-guide", label: "Jewellery Care Guide", href: "/pages/care-guide" },
  { slug: "return-policy", label: "Return & Replacement", href: "/pages/return-policy" },
  { slug: "shipping-policy", label: "Shipping Policy", href: "/pages/shipping-policy" },
  { slug: "privacy-policy", label: "Privacy Policy", href: "/pages/privacy-policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions", href: "/pages/terms-and-conditions" },
];

export async function generateStaticParams() {
  const slugs = await getPublishedPageSlugs();
  return (slugs.length ? slugs : ["care-guide", "return-policy", "shipping-policy"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "returns-and-exchanges") {
    redirect("/pages/return-policy");
  }
  const page = await getPublishedPage(slug);
  const cleanTitle = page ? page.title.replace(/\s*[–—\-]\s*SHIQUEEN\s*$/i, "").trim() : "Page not found";
  return { title: `${cleanTitle} | SHIQUEEN` };
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="mx-auto h-4 w-48 rounded-full bg-[#E5DEC9]/70" />
      <div className="mx-auto h-10 w-2/3 max-w-md rounded-xl bg-[#E5DEC9]/60" />
      <div className="mx-auto h-4 w-36 rounded-md bg-[#E5DEC9]/40" />
      <div className="mt-8 space-y-4 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10">
        <div className="h-6 w-full rounded-md bg-[#E5DEC9]/40" />
        <div className="h-6 w-5/6 rounded-md bg-[#E5DEC9]/40" />
        <div className="h-6 w-3/4 rounded-md bg-[#E5DEC9]/40" />
      </div>
    </div>
  );
}

async function PageContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  if (slug === "returns-and-exchanges") {
    redirect("/pages/return-policy");
  }
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  // Strip trailing "– SHIQUEEN" or "- SHIQUEEN" for clean presentation
  const cleanTitle = page.title.replace(/\s*[–—\-]\s*SHIQUEEN\s*$/i, "").trim();

  return (
    <>
      {/* ─── Centered Luxury Header ─── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DFC99B] bg-[#FAF6EE] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8C671A]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8C671A]" />
          <span>SHIQUEEN Official Guidelines</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-bold tracking-[0.03em] text-[#1A1410] sm:text-4xl lg:text-5xl">
          {cleanTitle}
        </h1>

        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-[#171717]/60">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E5DEC9] bg-white px-3 py-0.5 text-[11px] text-[#171717]/70 shadow-2xs">
            Last updated: {new Date(page.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* ─── Horizontal Policy Navigation Tabs ─── */}
      <div className="mt-7 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {POLICY_TABS.map((tab) => {
          const isActive = slug === tab.slug;
          return (
            <Link
              key={tab.slug}
              href={tab.href}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "border border-[#8C671A] bg-[#1A1410] text-[#FAF6EE] shadow-sm font-semibold"
                  : "border border-[#E5DEC9] bg-white text-[#171717]/75 hover:border-[#8C671A] hover:text-[#1A1410]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* ─── Card Content ─── */}
      <div className="mt-6 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10 lg:p-12 shadow-[0_4px_30px_rgba(26,20,16,0.03)]">
        <RichText text={page.body} />
      </div>

      {/* ─── WhatsApp Concierge Help Banner ─── */}
      <div className="mt-8 rounded-3xl border border-emerald-600/30 bg-emerald-950/[0.04] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600" />
            <span>1-on-1 Concierge Care</span>
          </div>
          <h3 className="mt-1 font-serif text-lg sm:text-xl font-bold text-[#111111]">
            Have questions about jewellery care or need order help?
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm text-[#171717]/70 leading-relaxed max-w-xl">
            Our styling and support team is available on WhatsApp at +91 7617693687 to guide you with care instructions, transit damage claims, and custom orders.
          </p>
        </div>
        <a
          href="https://wa.me/917617693687?text=Hi%20Shiqueen!%20I%20have%20a%20question%20regarding%20policies%20or%20jewellery%20care."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </>
  );
}

export default function InfoPage({ params }: PageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] pb-16 text-[#171717] lg:pb-0">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Suspense fallback={<PageSkeleton />}>
          <PageContent paramsPromise={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
