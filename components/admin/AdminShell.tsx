"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FileText,
  FolderTree,
  MessageSquareText,
  Palette,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  TicketPercent,
  Users,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
  { href: "/admin/coupons", label: "Coupons & offers", icon: TicketPercent },
  { href: "/admin/storefront", label: "Storefront", icon: Palette },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex h-12 items-center gap-3.5 rounded-xl px-4 text-[17px] font-medium transition ${
                active
                  ? "border border-[#E7D7AC] bg-[#FBF5E8] text-[#171717] shadow-[inset_3px_0_0_#B58A2A]"
                  : "text-[#171717]/75 hover:bg-[#F7F2E8] hover:text-[#171717]"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#9A741D]" : "text-[#8C671A]"}`} aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-1 border-t border-[#EFE8DD] pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex h-12 items-center gap-3.5 rounded-xl px-4 text-[17px] font-medium text-[#171717]/80 transition hover:bg-[#F3EEE4]"
      >
        <Store className="h-5 w-5 text-[#8C671A]" aria-hidden="true" />
        View store
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex h-12 w-full items-center gap-3.5 rounded-xl px-4 text-[17px] font-medium text-[#171717]/80 transition hover:bg-[#FEF3F2] hover:text-[#912018]"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E5DEC9] bg-[#FEFCEC]">
        <Image src="/images/shiqueen-emblem-2026t.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
      </span>
      <span>
        <span className="block font-serif text-xl font-bold tracking-[0.16em] text-[#171717]">SHIQUEEN</span>
        <span className="block text-[13px] font-semibold uppercase tracking-[0.2em] text-[#8C671A]">Admin</span>
      </span>
    </Link>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  // The drawer closes itself when a nav link is tapped (see NavLinks onNavigate).
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-base text-[#171717] print:bg-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-[#E9E2D5] bg-[#FFFEFC] px-4 py-6 lg:flex print:hidden">
        <div className="px-2">
          <Brand />
        </div>
        <nav aria-label="Admin" className="mt-8 flex-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <SidebarFooter />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5DEC9] bg-white/95 px-4 backdrop-blur lg:hidden print:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5DEC9] bg-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-80 flex-col bg-white px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between px-2">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-12 w-12 items-center justify-center rounded-xl hover:bg-[#F3EEE4]">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav aria-label="Admin" className="mt-6 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>
            <SidebarFooter />
          </div>
        </div>
      )}

      <main className="lg:pl-72 print:pl-0">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 print:max-w-none print:p-0">{children}</div>
      </main>
    </div>
  );
}
