"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/Toast";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type Field = "name" | "slug";

async function parseResponse(res: Response) {
  try {
    return await res.json();
  } catch {
    return { error: "پاسخ سرور نامعتبر بود" };
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

export default function RestaurantOnboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function validate() {
    const errors: Partial<Record<Field, string>> = {};
    if (!name.trim()) errors.name = "نام رستوران یا کافه را وارد کنید";
    if (!slug.trim()) {
      errors.slug = "آدرس انگلیسی منو را وارد کنید";
    } else if (!SLUG_RE.test(slug.trim())) {
      errors.slug = "فقط حروف انگلیسی کوچک، عدد و خط تیره مجاز است";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
        return;
      }

      showToast("رستوران با موفقیت ساخته شد", "success");
      router.refresh();
    } catch {
      showToast("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-semibold text-2xl text-ink mb-2 text-center">
          بساز رستوران/کافه‌ت رو
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          قبل از هر چیز، اطلاعات پایه‌ی کافه یا رستورانت رو وارد کن
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-card border border-ink/10 rounded-xl shadow-soft p-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-ink mb-1.5 font-medium">نام رستوران/کافه</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="کافه گلستان"
              className={`w-full border rounded-md px-4 py-2.5 bg-white focus:outline-none focus:ring-2 transition-shadow ${
                fieldErrors.name ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
              }`}
            />
            {fieldErrors.name && <p className="text-wine text-xs mt-1.5">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-ink mb-1.5 font-medium">آدرس انگلیسی منو</label>
            <div
              className={`flex items-center border rounded-md bg-white overflow-hidden focus-within:ring-2 transition-shadow ${
                fieldErrors.slug ? "border-wine ring-wine/20" : "border-ink/20 focus-within:ring-gold/40"
              }`}
            >
              <span className="text-muted text-sm pe-2 ps-3 border-e border-ink/10 whitespace-nowrap" dir="ltr">
                menu.app/
              </span>
              <input
                type="text"
                dir="ltr"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="golestan-cafe"
                className="flex-1 min-w-0 px-3 py-2.5 text-left focus:outline-none"
              />
            </div>
            {fieldErrors.slug && <p className="text-wine text-xs mt-1.5">{fieldErrors.slug}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-2.5 rounded-md font-medium hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            {loading ? "در حال ساخت..." : "ساخت رستوران"}
          </button>
        </form>
      </div>
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
