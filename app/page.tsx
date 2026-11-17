import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductShowcase from "@/components/ProductShowcase";
import GiftingStudio from "@/components/GiftingStudio";
import AntiTarnishProof from "@/components/AntiTarnishProof";
import TrustMarquee from "@/components/TrustMarquee";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#171717] pb-16 lg:pb-0">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <ProductShowcase />
        <GiftingStudio />
        <AntiTarnishProof />
        <TrustMarquee />
      </main>

      {/* Comprehensive Royal Luxury Footer */}
      <Footer />
    </div>
  );
}
