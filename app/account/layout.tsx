import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountNav from "@/components/account/AccountNav";
import { requireUser } from "@/lib/server/session";
import { ContentSkeleton } from "@/components/admin/AdminSkeleton";

export const metadata: Metadata = {
  title: { default: "My account | SHIQUEEN", template: "%s | SHIQUEEN" },
  robots: { index: false, follow: false },
};

// Every account page depends on the signed-in session.
export const instant = false;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] pb-16 text-base text-[#171717] lg:pb-0">
      <Header />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <Suspense fallback={<ContentSkeleton />}>
          <AccountGate>{children}</AccountGate>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

async function AccountGate({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
      <aside>
        <div className="mb-4 hidden lg:block">
          <p className="text-[15px] font-semibold uppercase tracking-[0.18em] text-[#8C671A]">My account</p>
          <p className="mt-1 truncate text-lg font-semibold">{user.name || user.email}</p>
        </div>
        <AccountNav isAdmin={user.role === "admin"} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
