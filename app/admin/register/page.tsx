"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toast, useToast } from "@/components/Toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = "restaurantName" | "email" | "password";

async function parseResponse(res: Response) {
  try {
    return await res.json();
  } catch {
    return { error: "پاسخ سرور نامعتبر بود" };
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  function validate() {
    const errors: Partial<Record<Field, string>> = {};
    if (!restaurantName.trim()) {
      errors.restaurantName = "نام رستوران یا کافه را وارد کنید";
    }
    if (!email.trim()) {
      errors.email = "ایمیل را وارد کنید";
    } else if (!EMAIL_RE.test(email.trim())) {
      errors.email = "فرمت ایمیل معتبر نیست";
    }
    if (!password) {
      errors.password = "رمز عبور را وارد کنید";
    } else if (password.length < 6) {
      errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantName, email, password }),
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
        return;
      }

      showToast("حساب با موفقیت ساخته شد", "success");
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      showToast("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-paper">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <span className="font-display font-semibold text-lg text-ink">منوی دیجیتال</span>
        </Link>

        <div className="bg-card border border-ink/10 rounded-xl shadow-soft p-7 md:p-8">
          <h1 className="font-display font-semibold text-2xl text-ink mb-2 text-center">
            ساخت حساب رستوران
          </h1>
          <p className="text-muted text-sm text-center mb-8">
            چند ثانیه‌ای منوی دیجیتال خودتون رو راه بندازید
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm text-ink mb-1.5 font-medium">
                نام رستوران/کافه
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className={`w-full border rounded-md px-4 py-2.5 bg-white focus:outline-none focus:ring-2 transition-shadow ${
                  fieldErrors.restaurantName
                    ? "border-wine ring-wine/20"
                    : "border-ink/20 focus:ring-gold/40"
                }`}
                placeholder="کافه گلستان"
              />
              {fieldErrors.restaurantName && (
                <p className="text-wine text-xs mt-1.5">{fieldErrors.restaurantName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5 font-medium">ایمیل</label>
              <input
                type="text"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-md px-4 py-2.5 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
                  fieldErrors.email ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
                }`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="text-wine text-xs mt-1.5">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5 font-medium">رمز عبور</label>
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-md px-4 py-2.5 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
                  fieldErrors.password ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
                }`}
                placeholder="حداقل ۶ کاراکتر"
              />
              {fieldErrors.password && (
                <p className="text-wine text-xs mt-1.5">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-2.5 rounded-md font-medium hover:bg-ink/90 transition-colors disabled:opacity-60"
            >
              {loading ? "در حال ساخت..." : "ساخت حساب"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          قبلاً حساب دارید؟{" "}
          <Link href="/admin/login" className="text-gold hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
      <Toast toast={toast} onDismiss={dismissToast} />
    </main>
  );
}
