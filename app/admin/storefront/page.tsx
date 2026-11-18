import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/server/session";
import { SECTIONS } from "@/lib/content/schema";
import { PageHeader } from "@/components/admin/ui";
import { buttonClass } from "@/components/ui/button-class";

export const metadata: Metadata = { title: "Storefront" };

const EXTRA = [
  { href: "/admin/categories", title: "Categories", description: "Category tiles on the homepage and collection pages." },
  { href: "/admin/products", title: "Products & bestsellers", description: "Tick “Feature on homepage” on a product to show it in Bestsellers." },
  { href: "/admin/coupons", title: "Offers", description: "Coupons marked “Show as offer” appear as offer cards on product pages." },
  { href: "/admin/reviews", title: "Reviews", description: "Approve customer reviews and feature the best ones on the homepage." },
  { href: "/admin/pages", title: "Policy pages", description: "Shipping, returns, privacy and other information pages." },
];

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function StorefrontPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        title="Storefront"
        description="Edit every text, image and link customers see on the website."
        actions={
          <Link href="/" target="_blank" className={buttonClass("secondary")}>
            <ExternalLink className="h-5 w-5" aria-hidden="true" /> View store
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/storefront/${s.key}`}
            className="group flex items-start justify-between gap-3 rounded-2xl border border-[#E5DEC9] bg-white p-5 transition hover:border-[#C59B27] sm:p-6"
          >
            <span>
              <span className="block text-xl font-semibold text-[#171717] group-hover:text-[#8C671A]">{s.title}</span>
              <span className="mt-1 block text-base text-[#171717]/65">{s.description}</span>
            </span>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#171717]/40" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold">Managed elsewhere</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {EXTRA.map((s) => (
          <Link key={s.href} href={s.href} className="group rounded-2xl border border-dashed border-[#D9CFB8] bg-[#FDFBF7] p-5 transition hover:border-[#C59B27]">
            <span className="block text-lg font-semibold group-hover:text-[#8C671A]">{s.title}</span>
            <span className="mt-1 block text-base text-[#171717]/65">{s.description}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
