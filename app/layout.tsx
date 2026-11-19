import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { SiteProvider } from "@/components/site/SiteProvider";
import { getPublicSite } from "@/lib/server/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://shiqueen.in"),
  title: "SHIQUEEN — Crafted For Every Queen | Anti-Tarnish Jewelry & Custom Hampers",
  description:
    "Shop Long-Lasting Anti-Tarnish & Everyday Wear Friendly Jewelry (Necklaces, Earrings, Bracelets, Rings, Anti-Tarnish Watches), Festive & Ethnic Sets, Customized Gift Hampers & Jewelry Bouquets with Pan-India Shipping & WhatsApp Order Support.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Cached storefront content (brand, menus, settings, offers) for every page.
  const site = await getPublicSite();
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Poppins:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#171717] font-sans selection:bg-[#F7DFC2] selection:text-[#171717]">
        <SiteProvider site={site}>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
