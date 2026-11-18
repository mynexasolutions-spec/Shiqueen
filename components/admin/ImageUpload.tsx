"use client";

import Image from "next/image";
import { useCallback, useId, useRef, useState, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, RefreshCw, Star, Trash2, UploadCloud } from "lucide-react";
import { getUploadAuth } from "@/app/admin/_actions/upload";

export interface UploadedImage {
  url: string;
  fileId: string;
}

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";

function validate(file: File): string | null {
  if (!ACCEPT.split(",").includes(file.type)) return `"${file.name}" isn't a supported image (JPG, PNG, WebP, AVIF or GIF).`;
  if (file.size > MAX_BYTES) return `"${file.name}" is larger than 10 MB.`;
  return null;
}

/** Uploads one file straight to ImageKit using a short-lived server signature. */
function uploadToImageKit(file: File, folder: string, onProgress: (pct: number) => void): Promise<UploadedImage> {
  return getUploadAuth().then(
    (auth) =>
      new Promise<UploadedImage>((resolve, reject) => {
        const form = new FormData();
        form.append("file", file);
        form.append("fileName", file.name.replace(/[^\w.-]+/g, "-").slice(-80) || "image");
        form.append("publicKey", auth.publicKey);
        form.append("signature", auth.signature);
        form.append("expire", String(auth.expire));
        form.append("token", auth.token);
        form.append("folder", folder);
        form.append("useUniqueFileName", "true");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.url) resolve({ url: data.url, fileId: data.fileId ?? "" });
            else reject(new Error(data.message || "Upload failed"));
          } catch {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(form);
      })
  );
}

function useDropzone(onFiles: (files: File[]) => void, disabled?: boolean) {
  const [dragging, setDragging] = useState(false);
  return {
    dragging,
    props: {
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      },
      onDragLeave: () => setDragging(false),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled && e.dataTransfer.files?.length) onFiles(Array.from(e.dataTransfer.files));
      },
    },
  };
}

// ───────────────────────── Single image ─────────────────────────

export function SingleImageUpload({
  name,
  initial,
  folder,
  required,
  aspect = "aspect-square",
  value,
  onChange,
}: {
  /** Hidden inputs `${name}_url` and `${name}_file_id` carry the value in the form (uncontrolled use). */
  name?: string;
  initial?: UploadedImage | null;
  folder: string;
  required?: boolean;
  aspect?: string;
  /** Controlled use (e.g. inside the storefront content editor). */
  value?: UploadedImage | null;
  onChange?: (img: UploadedImage | null) => void;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<UploadedImage | null>(initial?.url ? initial : null);
  const controlled = onChange !== undefined;
  const image = controlled ? (value?.url ? value : null) : internal;
  const setImage = useCallback((img: UploadedImage | null) => (onChange ? onChange(img) : setInternal(img)), [onChange]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const problem = validate(file);
      if (problem) return setError(problem);
      setError(null);
      setProgress(0);
      try {
        setImage(await uploadToImageKit(file, folder, setProgress));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setProgress(null);
      }
    },
    [folder, setImage]
  );

  const uploading = progress !== null;
  const { dragging, props } = useDropzone(handleFiles, uploading);

  return (
    <div>
      {name && <input type="hidden" name={`${name}_url`} value={image?.url ?? ""} />}
      {name && <input type="hidden" name={`${name}_file_id`} value={image?.fileId ?? ""} />}
      <input
        ref={fileRef}
        id={inputId}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          handleFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      {image && !uploading ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className={`relative w-full max-w-xs overflow-hidden rounded-2xl border border-[#E5DEC9] bg-[#FAF7F2] ${aspect}`}>
            <Image src={image.url} alt="Uploaded image" fill sizes="320px" className="object-cover" />
          </div>
          <div className="flex flex-row gap-3 sm:flex-col">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#D9CFB8] bg-white px-4 text-base font-semibold hover:border-[#8C671A]"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" /> Replace
            </button>
            {!required && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#F4C7C3] bg-white px-4 text-base font-semibold text-[#912018] hover:bg-[#FEF3F2]"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" /> Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          {...props}
          className={`flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
            dragging ? "border-[#8C671A] bg-[#FBF3DF]" : "border-[#D9CFB8] bg-[#FDFBF7] hover:border-[#8C671A] hover:bg-[#FBF7EE]"
          } ${uploading ? "pointer-events-none" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-[#8C671A]" aria-hidden="true" />
              <p className="mt-3 text-lg font-semibold">Uploading… {progress}%</p>
              <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#EFE8DD]">
                <div className="h-full bg-[#8C671A] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="h-11 w-11 text-[#8C671A]" aria-hidden="true" />
              <p className="mt-3 text-lg font-semibold text-[#171717]">Click to upload or drag an image here</p>
              <p className="mt-1 text-[15px] text-[#171717]/60">JPG, PNG, WebP or AVIF · up to 10 MB</p>
            </>
          )}
        </label>
      )}
      {error && (
        <p role="alert" className="mt-2 text-base font-medium text-[#B42318]">
          {error}
        </p>
      )}
    </div>
  );
}

// ───────────────────────── Multiple images (product gallery) ─────────────────────────

interface Pending {
  key: string;
  name: string;
  progress: number;
}

export function MultiImageUpload({
  images,
  onChange,
  folder,
  max = 12,
}: {
  images: UploadedImage[];
  onChange: (next: UploadedImage[] | ((prev: UploadedImage[]) => UploadedImage[])) => void;
  folder: string;
  max?: number;
}) {
  const inputId = useId();
  const [pending, setPending] = useState<Pending[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const room = max - images.length - pending.length;
      const problems: string[] = [];
      if (files.length > room) problems.push(`You can add up to ${max} images per product.`);
      const accepted = files.slice(0, Math.max(0, room)).filter((f) => {
        const p = validate(f);
        if (p) problems.push(p);
        return !p;
      });
      setErrors(problems);

      await Promise.all(
        accepted.map(async (file) => {
          const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`;
          setPending((p) => [...p, { key, name: file.name, progress: 0 }]);
          try {
            const uploaded = await uploadToImageKit(file, folder, (pct) =>
              setPending((p) => p.map((x) => (x.key === key ? { ...x, progress: pct } : x)))
            );
            onChange((prev) => [...prev, uploaded]);
          } catch (e) {
            setErrors((errs) => [...errs, `"${file.name}": ${e instanceof Error ? e.message : "upload failed"}`]);
          } finally {
            setPending((p) => p.filter((x) => x.key !== key));
          }
        })
      );
    },
    [folder, images.length, max, onChange, pending.length]
  );

  const { dragging, props } = useDropzone(handleFiles);

  const move = (from: number, to: number) =>
    onChange((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });

  const remove = (index: number) => onChange((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {(images.length > 0 || pending.length > 0) && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {images.map((img, i) => (
            <li key={`${img.url}-${i}`} className="overflow-hidden rounded-2xl border border-[#E5DEC9] bg-white">
              <div className="relative aspect-square bg-[#FAF7F2]">
                <Image src={img.url} alt={`Product image ${i + 1}`} fill sizes="(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 45vw" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#171717] px-3 py-1 text-[13px] font-semibold text-white">
                    <Star className="h-3.5 w-3.5 fill-[#E9C46A] text-[#E9C46A]" aria-hidden="true" /> Main
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    aria-label="Move image left"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#F3EEE4] disabled:opacity-30"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === images.length - 1}
                    aria-label="Move image right"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#F3EEE4] disabled:opacity-30"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove image"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[#B42318] hover:bg-[#FEF3F2]"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => move(i, 0)}
                  className="mx-2 mb-2 flex h-10 w-[calc(100%-1rem)] items-center justify-center gap-1.5 rounded-lg border border-[#E5DEC9] text-[15px] font-semibold text-[#8C671A] hover:bg-[#FBF3DF]"
                >
                  <Star className="h-4 w-4" aria-hidden="true" /> Make main
                </button>
              )}
            </li>
          ))}
          {pending.map((p) => (
            <li key={p.key} className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9CFB8] bg-[#FDFBF7] p-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#8C671A]" aria-hidden="true" />
              <p className="mt-2 line-clamp-1 text-[14px] text-[#171717]/70">{p.name}</p>
              <p className="text-base font-semibold">{p.progress}%</p>
            </li>
          ))}
        </ul>
      )}

      {images.length + pending.length < max && (
        <label
          htmlFor={inputId}
          {...props}
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-7 text-center transition ${
            dragging ? "border-[#8C671A] bg-[#FBF3DF]" : "border-[#D9CFB8] bg-[#FDFBF7] hover:border-[#8C671A] hover:bg-[#FBF7EE]"
          }`}
        >
          <ImagePlus className="h-10 w-10 text-[#8C671A]" aria-hidden="true" />
          <p className="mt-2 text-lg font-semibold">Click to add images or drag them here</p>
          <p className="mt-1 text-[15px] text-[#171717]/60">
            Select several at once · JPG, PNG, WebP or AVIF · up to 10 MB each · {images.length}/{max} used
          </p>
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              handleFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
      )}

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-base font-medium text-[#B42318]">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
