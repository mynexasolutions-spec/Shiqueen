"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, MapPin, Package, Shield, UserRound } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

const LINKS = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile & password", icon: UserRound },
];

export default function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Account" className="lg:sticky lg:top-6">
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-12 items-center gap-3 whitespace-nowrap rounded-xl px-4 text-[17px] font-medium transition ${
                  active ? "bg-[#171717] text-white" : "bg-white text-[#171717]/80 hover:bg-[#F3EEE4] lg:bg-transparent"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-[#E9C46A]" : "text-[#8C671A]"}`} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
        {isAdmin && (
          <li className="shrink-0">
            <Link href="/admin" className="flex h-12 items-center gap-3 whitespace-nowrap rounded-xl bg-[#FBF3DF] px-4 text-[17px] font-semibold text-[#6F5114] hover:bg-[#F7E9C4]">
              <Shield className="h-5 w-5" aria-hidden="true" /> Admin dashboard
            </Link>
          </li>
        )}
        <li className="shrink-0">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex h-12 w-full items-center gap-3 whitespace-nowrap rounded-xl bg-white px-4 text-[17px] font-medium text-[#171717]/80 transition hover:bg-[#FEF3F2] hover:text-[#912018] lg:bg-transparent"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" /> Sign out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
