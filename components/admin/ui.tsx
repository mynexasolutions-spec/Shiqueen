import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Tone } from "@/lib/format";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-7">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-base font-semibold text-[#8C671A] hover:underline">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[32px] font-bold leading-tight text-[#171717] sm:text-[38px]">{title}</h1>
          {description && <p className="mt-1.5 text-[17px] text-[#171717]/70">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ title, description, actions, children, className, padded = true }: {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cx("rounded-2xl border border-[#E9E2D5] bg-white shadow-[0_8px_24px_rgba(65,49,20,0.045)]", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0EBE2] px-5 py-4 sm:px-6">
          <div>
            {title && <h2 className="text-xl font-semibold text-[#171717]">{title}</h2>}
            {description && <p className="mt-0.5 text-[15px] text-[#171717]/65">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={padded ? "p-5 sm:p-6" : undefined}>{children}</div>
    </section>
  );
}

const TONES: Record<Tone, string> = {
  neutral: "bg-[#F0EEEA] text-[#3D3A35]",
  gold: "bg-[#FBF0D5] text-[#6F5114]",
  blue: "bg-[#E6EEFB] text-[#1F4E9C]",
  green: "bg-[#E3F4E8] text-[#0F5B2B]",
  red: "bg-[#FDE8E7] text-[#912018]",
  amber: "bg-[#FDF1DC] text-[#8A4B00]",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[14px] font-semibold", TONES[tone])}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF3DF] text-[#8C671A]">{icon}</div>}
      <p className="text-xl font-semibold text-[#171717]">{title}</p>
      {body && <p className="mt-1.5 max-w-md text-base text-[#171717]/65">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Plain GET search/filter bar — works without JavaScript. */
export function SearchBar({
  action,
  q,
  placeholder,
  children,
}: {
  action: string;
  q?: string;
  placeholder: string;
  children?: ReactNode;
}) {
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#171717]/45" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-12 w-full rounded-xl border border-[#D9CFB8] bg-white pl-12 pr-4 text-base placeholder:text-[#171717]/45 focus:border-[#8C671A] focus:outline-none focus:ring-4 focus:ring-[#C59B27]/20"
        />
      </div>
      {children}
      <button type="submit" className="h-12 rounded-xl bg-[#171717] px-6 text-base font-semibold text-white transition hover:bg-[#8C671A]">
        Search
      </button>
    </form>
  );
}

export function FilterSelect({ name, value, options, label }: { name: string; value?: string; options: { value: string; label: string }[]; label: string }) {
  return (
    <select
      name={name}
      defaultValue={value ?? ""}
      aria-label={label}
      className="h-12 cursor-pointer rounded-xl border border-[#D9CFB8] bg-white px-4 text-base focus:border-[#8C671A] focus:outline-none focus:ring-4 focus:ring-[#C59B27]/20"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (p: number) => string }) {
  if (totalPages <= 1) return null;
  const linkCls = "inline-flex h-11 items-center gap-1 rounded-xl border border-[#D9CFB8] bg-white px-4 text-base font-semibold hover:border-[#8C671A]";
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkCls}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-base text-[#171717]/70">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkCls}>
          Next <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Builds a URL keeping existing filters. */
export function withParams(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
      <dt className="w-44 shrink-0 text-[15px] font-medium text-[#171717]/60">{label}</dt>
      <dd className="text-base text-[#171717]">{children}</dd>
    </div>
  );
}
