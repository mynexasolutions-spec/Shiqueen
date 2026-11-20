"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  compact = false,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for non-secure contexts
      const el = document.createElement("textarea");
      el.value = value;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border font-semibold transition ${
        copied
          ? "border-[#137333]/35 bg-[#E6F4EA] text-[#0F5B2B]"
          : "border-[#D9CFB8] bg-white text-[#171717]/80 hover:border-[#8C671A] hover:text-[#8C671A]"
      } ${compact ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm"}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
