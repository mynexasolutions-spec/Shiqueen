"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, Plus, Trash2 } from "lucide-react";
import { Alert, Button, Field as FormField, Input, Select, Textarea } from "@/components/ui/form";
import { Card } from "@/components/admin/ui";
import { SingleImageUpload } from "@/components/admin/ImageUpload";
import type { Field, SectionDef } from "@/lib/content/schema";
import { saveContentAction } from "@/app/admin/_actions/content";

type Obj = Record<string, unknown>;

function emptyFor(fields: Field[]): Obj {
  const o: Obj = {};
  for (const f of fields) {
    if (f.type === "list" || f.type === "lines") o[f.key] = [];
    else if (f.type === "checkbox") o[f.key] = false;
    else if (f.type === "number") o[f.key] = f.min ?? 0;
    else if (f.type === "select") o[f.key] = f.options[0]?.value ?? "";
    else o[f.key] = "";
  }
  return o;
}

function isGradient(v: string) {
  return /gradient\(/i.test(v);
}

function FieldInput({ field, value, onChange, idBase }: { field: Field; value: unknown; onChange: (v: unknown) => void; idBase: string }) {
  const id = `${idBase}-${field.key}`;
  switch (field.type) {
    case "text":
    case "link":
      return (
        <FormField label={field.label} htmlFor={id} hint={field.hint}>
          <Input
            id={id}
            value={String(value ?? "")}
            maxLength={field.type === "text" ? field.max ?? 300 : 500}
            placeholder={field.type === "text" ? field.placeholder : "/collections/necklaces"}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormField>
      );
    case "textarea":
      return (
        <FormField label={field.label} htmlFor={id} hint={field.hint}>
          <Textarea id={id} rows={field.rows ?? 3} maxLength={field.max ?? 3000} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </FormField>
      );
    case "number":
      return (
        <FormField label={field.label} htmlFor={id} hint={field.hint}>
          <Input
            id={id}
            type="number"
            min={field.min}
            max={field.max}
            value={value === "" || value == null ? "" : String(value)}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </FormField>
      );
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5DEC9] bg-white p-4 hover:border-[#C59B27]">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#8C671A]" />
          <span>
            <span className="block text-base font-semibold">{field.label}</span>
            {field.hint && <span className="block text-[15px] text-[#171717]/65">{field.hint}</span>}
          </span>
        </label>
      );
    case "color": {
      const v = String(value ?? "");
      return (
        <FormField label={field.label} htmlFor={id} hint={field.hint}>
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 shrink-0 rounded-xl border border-[#D9CFB8]" style={{ background: v || "#ffffff" }} aria-hidden="true" />
            {!isGradient(v) && (
              <input
                type="color"
                aria-label={`${field.label} picker`}
                value={/^#[0-9a-f]{6}$/i.test(v) ? v : "#ffffff"}
                onChange={(e) => onChange(e.target.value)}
                className="h-12 w-14 cursor-pointer rounded-xl border border-[#D9CFB8] bg-white p-1"
              />
            )}
            <Input id={id} value={v} maxLength={300} onChange={(e) => onChange(e.target.value)} />
          </div>
        </FormField>
      );
    }
    case "image":
      return (
        <div>
          <p className="mb-2 text-base font-semibold">{field.label}</p>
          <SingleImageUpload
            folder={field.folder ?? "/shiqueen/content"}
            aspect={field.aspect}
            value={value ? { url: String(value), fileId: "" } : null}
            onChange={(img) => onChange(img?.url ?? "")}
          />
          {field.hint && <p className="mt-1.5 text-[15px] text-[#171717]/65">{field.hint}</p>}
        </div>
      );
    case "select":
      return (
        <FormField label={field.label} htmlFor={id} hint={field.hint}>
          <Select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FormField>
      );
    case "lines": {
      const text = Array.isArray(value) ? (value as string[]).join("\n") : String(value ?? "");
      return (
        <FormField label={field.label} htmlFor={id} hint={field.hint}>
          <Textarea
            id={id}
            rows={Math.min(10, Math.max(3, text.split("\n").length + 1))}
            value={text}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
        </FormField>
      );
    }
    case "list":
      return <ListEditor field={field} value={Array.isArray(value) ? (value as Obj[]) : []} onChange={onChange} idBase={id} />;
  }
}

function ObjectFields({ fields, value, onChange, idBase }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; idBase: string }) {
  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} idBase={idBase} />
      ))}
    </div>
  );
}

function ListEditor({ field, value, onChange, idBase }: { field: Extract<Field, { type: "list" }>; value: Obj[]; onChange: (v: Obj[]) => void; idBase: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const max = field.maxItems ?? 40;
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    setOpen(to);
  };

  return (
    <div>
      <p className="mb-1 text-base font-semibold">{field.label}</p>
      {field.hint && <p className="mb-2 text-[15px] text-[#171717]/65">{field.hint}</p>}
      <ul className="space-y-2">
        {value.map((item, i) => {
          const title = String((field.titleKey && item[field.titleKey]) || "").trim() || `${field.itemLabel[0].toUpperCase()}${field.itemLabel.slice(1)} ${i + 1}`;
          const isOpen = open === i;
          return (
            <li key={i} className="rounded-xl border border-[#E5DEC9] bg-[#FDFBF7]">
              <div className="flex items-center gap-1 p-1.5 pl-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left text-base font-medium hover:bg-[#F3EEE4]"
                >
                  {isOpen ? <ChevronDown className="h-5 w-5 shrink-0" /> : <ChevronRight className="h-5 w-5 shrink-0" />}
                  <span className="truncate">{title}</span>
                </button>
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#F3EEE4] disabled:opacity-30">
                  <ArrowUp className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label="Move down" className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#F3EEE4] disabled:opacity-30">
                  <ArrowDown className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => value.length < max && onChange([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])}
                  disabled={value.length >= max}
                  aria-label="Duplicate"
                  className="hidden h-10 w-10 items-center justify-center rounded-lg hover:bg-[#F3EEE4] disabled:opacity-30 sm:flex"
                >
                  <Copy className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove “${title}”?`)) {
                      onChange(value.filter((_, j) => j !== i));
                      setOpen(null);
                    }
                  }}
                  aria-label="Remove"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[#B42318] hover:bg-[#FEF3F2]"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-[#EFE8DD] bg-white p-4 sm:p-5">
                  <ObjectFields fields={field.fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} idBase={`${idBase}-${i}`} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {value.length < max && (
        <button
          type="button"
          onClick={() => {
            onChange([...value, emptyFor(field.fields)]);
            setOpen(value.length);
          }}
          className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl border border-[#D9CFB8] bg-white px-4 text-base font-semibold hover:border-[#8C671A]"
        >
          <Plus className="h-5 w-5" /> Add {field.itemLabel}
        </button>
      )}
    </div>
  );
}

export default function ContentEditor({ def, initial }: { def: SectionDef; initial: Obj }) {
  const [value, setValue] = useState<Obj>(initial);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ error?: string; message?: string }>({});

  const update = (v: Obj) => {
    setValue(v);
    setDirty(true);
    setResult({});
  };

  const save = () =>
    start(async () => {
      const res = await saveContentAction(def.key, JSON.stringify(value));
      setResult(res);
      if (!res.error) {
        setDirty(false);
        if (res.saved) setValue(res.saved);
      }
    });

  return (
    <div className="space-y-6 pb-24">
      {def.groups.map((g) => (
        <Card key={g.title} title={g.title} description={g.description}>
          <ObjectFields fields={g.fields} value={value} onChange={update} idBase={def.key} />
        </Card>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E5DEC9] bg-white/95 px-4 py-3 backdrop-blur lg:left-72">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 lg:px-6">
          <div className="min-w-0 flex-1">
            {result.error && <Alert tone="error">{result.error}</Alert>}
            {result.message && !dirty && <Alert tone="success">{result.message}</Alert>}
            {!result.error && !result.message && (
              <p className="text-base text-[#171717]/70">{dirty ? "You have unsaved changes." : "All changes saved."}</p>
            )}
          </div>
          <Button type="button" size="lg" onClick={save} disabled={pending || !dirty}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
