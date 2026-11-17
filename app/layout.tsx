import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shiqueen.in"),
  title: "SHIQUEEN — Crafted For Every Queen | Anti-Tarnish Jewelry & Custom Hampers",
  description:
    "Shop 100% Anti-Tarnish & Waterproof Jewelry (Necklaces, Earrings, Bracelets, Rings, Anti-Tarnish Watches), Festive & Ethnic Sets, Customized Gift Hampers & Jewelry Bouquets with Pan-India Shipping & WhatsApp Order Support.",
  icons: {
    icon: "/images/shiqueen-logo.jpg",
    apple: "/images/shiqueen-logo.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
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
        {children}
      </body>
    </html>
  );
}
