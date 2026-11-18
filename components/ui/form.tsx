"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { buttonClass, type Size, type Variant } from "./button-class";

export { buttonClass };

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const control =
  "block w-full rounded-xl border border-[#D9CFB8] bg-white px-4 text-base text-[#171717] placeholder:text-[#171717]/45 " +
  "transition focus:border-[#8C671A] focus:outline-none focus:ring-4 focus:ring-[#C59B27]/20 disabled:cursor-not-allowed disabled:bg-[#F3EEE4]";

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-base font-semibold text-[#171717]">
        {label}
        {required && <span className="ml-1 text-[#B42318]" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[15px] leading-snug text-[#171717]/65">{hint}</p>}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(control, "h-12", className)} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(control, "py-3 leading-relaxed", className)} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cx(control, "h-12 cursor-pointer pr-10", className)}>
      {children}
    </select>
  );
}

export function Checkbox({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5DEC9] bg-white p-4 transition hover:border-[#C59B27]">
      <input type="checkbox" {...props} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#8C671A]" />
      <span>
        <span className="block text-base font-semibold text-[#171717]">{label}</span>
        {hint && <span className="mt-0.5 block text-[15px] text-[#171717]/65">{hint}</span>}
      </span>
    </label>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={buttonClass(variant, size, className)} />;
}

/** Submit button that shows a spinner while its parent <form> action is pending. */
export function SubmitButton({
  children,
  pendingText,
  variant = "primary",
  size = "md",
  className,
  pending: pendingProp,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pendingText?: string; variant?: Variant; size?: Size; pending?: boolean }) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending || props.disabled} {...props} className={buttonClass(variant, size, className)}>
      {pending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
      {pending ? pendingText ?? children : children}
    </button>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: ReactNode }) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-base leading-snug",
        tone === "error" && "border-[#F4C7C3] bg-[#FEF3F2] text-[#912018]",
        tone === "success" && "border-[#B7E1C1] bg-[#ECF8EF] text-[#0F5B2B]",
        tone === "info" && "border-[#E5DEC9] bg-[#FBF7EE] text-[#5C4512]"
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
