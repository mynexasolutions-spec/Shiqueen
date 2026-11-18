import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#171717]">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="font-serif text-6xl font-bold text-[#8C671A]">404</span>
        <h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-2 max-w-md text-sm text-[#171717]/70">
          The jewelry collection or page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-[#171717] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition hover:bg-[#8C671A]"
        >
          Back To Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
