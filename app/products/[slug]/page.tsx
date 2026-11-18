import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustMarquee from "@/components/TrustMarquee";
import ProductDetailView from "@/components/product/ProductDetailView";
import { getProductReviews, getStoreReviews } from "@/lib/server/reviews";
import { getAllProductSlugs, getProductPageData } from "@/lib/server/catalog";
import { getPublicSite } from "@/lib/server/content";

// Catalogue pages are fully static (cached DB reads). New slugs created in the
// admin render completely on their first visit instead of showing a skeleton.
export const ensureStatic = "navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const BRAND = (await getPublicSite()).content.brand;
  const product = (await getProductPageData(slug))?.product;

  if (!product) {
    return {
      title: `Product Not Found | ${BRAND.name}`,
    };
  }

  return {
    title: `Buy ${product.name} — ${product.plating} | ${BRAND.name}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${BRAND.name}`,
      description: product.description,
      images: [product.primaryImage, product.hoverImage],
    },
  };
}

async function ProductContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const data = await getProductPageData(slug);

  if (!data) {
    notFound();
  }

  const { product, collection, specifications, relatedProducts } = data;
  const [reviews, store] = await Promise.all([getProductReviews(product.id), getStoreReviews()]);

  return (
    <ProductDetailView
      key={product.slug}
      product={product}
      collection={collection}
      specifications={specifications}
      reviews={reviews}
      storeReviews={store.reviews}
      storeReviewTotal={store.total}
      relatedProducts={relatedProducts}
    />
  );
}

function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1760px] animate-pulse px-4 py-8 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-4 lg:col-span-7">
          <div className="aspect-[3/4] w-full rounded-2xl bg-[#E5DEC9]/50" />
          <div className="aspect-[3/4] w-full rounded-2xl bg-[#E5DEC9]/50" />
        </div>
        <div className="space-y-4 rounded-3xl border border-[#E5DEC9] bg-white p-6 lg:col-span-5">
          <div className="h-4 w-32 rounded-md bg-[#E5DEC9]/60" />
          <div className="h-8 w-3/4 rounded-lg bg-[#E5DEC9]/80" />
          <div className="h-6 w-1/2 rounded-md bg-[#E5DEC9]/60" />
          <div className="h-24 w-full rounded-xl bg-[#E5DEC9]/40" />
          <div className="h-12 w-full rounded-full bg-[#E5DEC9]/80" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: PageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#171717] pb-16 lg:pb-0">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<ProductPageSkeleton />}>
          <ProductContent paramsPromise={params} />
        </Suspense>
        <TrustMarquee />
      </main>

      <Footer />
    </div>
  );
}
