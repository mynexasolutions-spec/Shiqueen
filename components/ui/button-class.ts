// Shared by Server and Client Components (no "use client").
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export type Variant = "primary" | "secondary" | "danger" | "ghost" | "gold";
export type Size = "md" | "lg" | "sm";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#C59B27]/30",
    size === "lg" && "h-13 px-6 text-[17px]",
    size === "md" && "h-12 px-5 text-base",
    size === "sm" && "h-10 px-4 text-[15px]",
    variant === "primary" && "bg-[#171717] text-white hover:bg-[#8C671A]",
    variant === "gold" && "bg-[#8C671A] text-white hover:bg-[#6F5114]",
    variant === "secondary" && "border border-[#D9CFB8] bg-white text-[#171717] hover:border-[#8C671A] hover:text-[#8C671A]",
    variant === "danger" && "bg-[#B42318] text-white hover:bg-[#912018]",
    variant === "ghost" && "text-[#171717] hover:bg-[#F3EEE4]",
    className
  );
}
