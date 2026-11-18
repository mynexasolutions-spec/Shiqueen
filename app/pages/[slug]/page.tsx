import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichText from "@/components/site/RichText";
import { getPublishedPage, getPublishedPageSlugs } from "@/lib/server/pages";

// Information pages are static (cached) and refreshed when edited in Admin → Pages.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const slugs = await getPublishedPageSlugs();
  // At least one entry is required; an unknown slug simply 404s.
  return (slugs.length ? slugs : ["shipping-policy"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  return { title: page ? `${page.title} | SHIQUEEN` : "Page not found | SHIQUEEN" };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] pb-16 text-[#171717] lg:pb-0">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-serif text-4xl font-bold text-[#111111] sm:text-5xl">{page.title}</h1>
        <p className="mt-2 text-sm text-[#171717]/55">
          Last updated {new Date(page.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="mt-8 rounded-3xl border border-[#E5DEC9] bg-white p-6 sm:p-10">
          <RichText text={page.body} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
