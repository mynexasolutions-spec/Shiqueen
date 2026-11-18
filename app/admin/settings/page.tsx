import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/server/session";
import { getSettings } from "@/lib/server/settings";
import { PageHeader } from "@/components/admin/ui";
import SettingsForm, { type SettingsTab } from "@/components/admin/SettingsForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export const metadata: Metadata = { title: "Settings" };

const TABS: SettingsTab[] = ["payments", "shipping", "reviews", "store", "security"];

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [admin, settings, sp] = await Promise.all([requireAdmin(), getSettings(), searchParams]);
  const initialTab = TABS.includes(sp.tab as SettingsTab) ? (sp.tab as SettingsTab) : "payments";

  return (
    <>
      <PageHeader title="Settings" description="Payments, delivery, reviews and your admin account." />
      <SettingsForm
        initial={settings}
        initialTab={initialTab}
        security={
          <section className="rounded-2xl border border-[#E5DEC9] bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
            <header className="border-b border-[#EFE8DD] px-5 py-4 sm:px-7 sm:py-5">
              <h2 className="text-xl font-semibold sm:text-[22px]">Security</h2>
              <p className="mt-1 text-[15px] text-[#171717]/65 sm:text-base">Change the password you use to sign in.</p>
            </header>
            <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 xl:grid-cols-[1fr_320px]">
              <div className="max-w-lg">
                <ChangePasswordForm />
              </div>
              <div className="space-y-3 rounded-2xl bg-[#FAF7F2] p-5 text-base">
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-5 w-5 text-[#137333]" aria-hidden="true" /> Signed in as
                </p>
                <p className="break-all text-[#171717]/80">{admin.email}</p>
                <p className="text-[15px] text-[#171717]/65">
                  Changing your password signs you out on every other device. You can always sign in with a one-time email code instead.
                </p>
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
