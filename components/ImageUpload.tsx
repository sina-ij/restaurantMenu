"use client";

import { useRef, useState } from "react";
import { ImageSquare, SpinnerGap, ArrowsClockwise, X } from "@phosphor-icons/react";

// آپلودِ عکسِ یکدست برای کلِ داشبورد: یک ناحیه‌ی دراپ‌زونِ نقطه‌چینِ خوش‌شکل،
// با پیش‌نمایش، حالتِ در حال آپلود و خطا. خودش POST به /api/upload می‌زند.
export function ImageUpload({
  value,
  onChange,
  label = "افزودن عکس",
  hint = "jpg، png یا webp تا ۵ مگابایت",
  className = "",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({ error: "پاسخ سرور نامعتبر بود" }));
      if (res.ok && data.url) onChange(data.url);
      else setError(data.error || "آپلود عکس با خطا مواجه شد");
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-2.5">
          <img src={value} alt="پیش‌نمایش" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
          <div className="flex flex-1 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-ink/15 px-3 py-1.5 text-sm text-ink transition-colors hover:border-gold/60 disabled:opacity-60"
            >
              {uploading ? (
                <SpinnerGap className="h-4 w-4 animate-spin" weight="bold" />
              ) : (
                <ArrowsClockwise className="h-4 w-4" weight="bold" />
              )}
              {uploading ? "در حال آپلود..." : "تغییر عکس"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-wine transition-colors hover:bg-wine/5"
            >
              <X className="h-4 w-4" weight="bold" />
              حذف
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-ink/20 bg-paper/60 p-4 text-start transition-colors hover:border-gold/60 disabled:opacity-70"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
            {uploading ? (
              <SpinnerGap className="h-5 w-5 animate-spin" weight="bold" />
            ) : (
              <ImageSquare className="h-5 w-5" weight="duotone" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">
              {uploading ? "در حال آپلود..." : label}
            </span>
            <span className="mt-0.5 block text-xs text-muted">{hint}</span>
          </span>
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-wine">{error}</p>}
    </div>
  );
}
