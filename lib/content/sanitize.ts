import type { Field, SectionDef } from "./schema";

// Coerces untrusted editor input into the exact shape the schema describes.
// Anything not described by the schema is dropped.

const str = (v: unknown, max: number) => (typeof v === "string" ? v : v == null ? "" : String(v)).trim().slice(0, max);

export const isSafeImage = (u: string) => /^https:\/\/ik\.imagekit\.io\/[^\s"'<>]+$/.test(u) || /^\/images\/[\w\-/.]+$/.test(u);

export function safeLink(raw: unknown): string {
  const u = str(raw, 500);
  if (!u) return "";
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  if (u.startsWith("#")) return u;
  if (/^(https?:\/\/|mailto:|tel:)[^\s"'<>]+$/i.test(u)) return u;
  return "";
}

function safeColor(raw: unknown): string {
  const c = str(raw, 300);
  // Hex/rgb/hsl/named colours and linear/radial gradients only — no url(), no semicolons.
  if (!c || /url\s*\(|[;{}<>"'\\]|expression/i.test(c)) return "";
  return /^[#\w\s(),.%\-+]+$/.test(c) ? c : "";
}

function sanitizeField(field: Field, value: unknown): unknown {
  switch (field.type) {
    case "text":
      return str(value, field.max ?? 300);
    case "textarea":
      return str(value, field.max ?? 3000);
    case "number": {
      const n = Number(value);
      if (!Number.isFinite(n)) return field.min ?? 0;
      return Math.min(field.max ?? 1e9, Math.max(field.min ?? -1e9, Math.round(n * 100) / 100));
    }
    case "checkbox":
      return value === true || value === "on" || value === "true";
    case "color":
      return safeColor(value);
    case "image": {
      const u = str(value, 1000);
      return isSafeImage(u) ? u : "";
    }
    case "link":
      return safeLink(value);
    case "select": {
      const v = str(value, 100);
      return field.options.some((o) => o.value === v) ? v : field.options[0]?.value ?? "";
    }
    case "lines": {
      const arr = Array.isArray(value) ? value : typeof value === "string" ? value.split("\n") : [];
      return arr
        .map((l) => str(l, field.max ?? 300))
        .filter(Boolean)
        .slice(0, 40);
    }
    case "list": {
      const arr = Array.isArray(value) ? value : [];
      return arr
        .filter((item) => item && typeof item === "object")
        .slice(0, field.maxItems ?? 40)
        .map((item) => sanitizeObject(field.fields, item as Record<string, unknown>));
    }
  }
}

function sanitizeObject(fields: Field[], obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.key] = sanitizeField(f, obj?.[f.key]);
  return out;
}

export function sanitizeSection(def: SectionDef, raw: unknown): Record<string, unknown> {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const g of def.groups) Object.assign(out, sanitizeObject(g.fields, obj));
  return out;
}
