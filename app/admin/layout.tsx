import type { Metadata } from "next";
import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/session";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

export const metadata: Metadata = {
  title: { default: "Admin | SHIQUEEN", template: "%s | SHIQUEEN Admin" },
  robots: { index: false, follow: false },
};

// The whole admin area depends on the signed-in session, so navigations into it
// are allowed to wait on the server.
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
