import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustMarquee from "@/components/TrustMarquee";
import CollectionView from "@/components/collection/CollectionView";
import { getAllCategorySlugs, getCollectionPageData } from "@/lib/server/catalog";
import { getPublicSite } from "@/lib/server/content";

// Catalogue pages are fully static (cached DB reads). New slugs created in the
// admin render completely on their first visit instead of showing a skeleton.
export const ensureStatic = "navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const BRAND = (await getPublicSite()).content.brand;
  const collection = (await getCollectionPageData(slug))?.collection;

  if (!collection) {
    return {
      title: `Collection Not Found | ${BRAND.name}`,
    };
  }

  return {
    title: `${collection.name} — 100% Anti-Tarnish Jewelry | ${BRAND.name}`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | ${BRAND.name}`,
      description: collection.description,
      images: [collection.bannerImage],
    },
  };
}

async function CollectionContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const data = await getCollectionPageData(slug);

  if (!data) {
    notFound();
  }

  return <CollectionView key={slug} collection={data.collection} initialProducts={data.products} />;
}

function CollectionSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-[#E5DEC9] bg-[#FAF7F2] py-8 sm:py-12">
        <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="h-4 w-32 rounded-full bg-[#E5DEC9]/60" />
          <div className="mt-4 h-10 w-64 rounded-xl bg-[#E5DEC9]/80" />
          <div className="mt-2 h-4 max-w-xl rounded-md bg-[#E5DEC9]/50" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="mx-auto max-w-[1760px] px-4 py-8 sm:px-6 sm:py-10 lg:px-12 xl:px-16 2xl:px-20">
        <div className="mb-6 h-12 rounded-2xl bg-white/70" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-5 xl:gap-6 2xl:gap-7">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E5DEC9] bg-white p-3 sm:p-4"
            >
              <div className="aspect-square w-full rounded-xl bg-[#E5DEC9]/40" />
              <div className="mt-3 h-4 w-3/4 rounded-md bg-[#E5DEC9]/60" />
              <div className="mt-2 h-4 w-1/3 rounded-md bg-[#E5DEC9]/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CollectionPage({ params }: PageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#171717]">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<CollectionSkeleton />}>
          <CollectionContent paramsPromise={params} />
        </Suspense>
        <TrustMarquee />
      </main>

      <Footer />
    </div>
  );
}
