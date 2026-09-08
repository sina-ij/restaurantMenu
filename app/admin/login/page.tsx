"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toast, useToast } from "@/components/Toast";
import { AuthBackground } from "@/components/AuthBackground";
import { PasswordInput } from "@/components/PasswordInput";
import { ThemeToggle } from "@/components/ThemeToggle";

type Field = "email" | "password";

async function parseResponse(res: Response) {
  try {
    return await res.json();
  } catch {
    return { error: "پاسخ سرور نامعتبر بود" };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  function validate() {
    const errors: Partial<Record<Field, string>> = {};
    if (!email.trim()) errors.email = "ایمیل را وارد کنید";
    if (!password) errors.password = "رمز عبور را وارد کنید";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
        return;
      }

      showToast("خوش آمدید", "success");
      router.push(data.role === "SUPER_ADMIN" ? "/admin/super" : "/admin/dashboard");
      router.refresh();
    } catch {
      showToast("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthBackground>
      <div className="absolute top-4 left-4 z-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm mx-auto">
        <Link href="/" className="block text-center mb-8">
          <span className="font-display font-semibold text-lg text-ink">منوی دیجیتال</span>
        </Link>

        <div className="bg-card border border-ink/10 rounded-2xl shadow-lift p-7 md:p-8">
          <h1 className="font-display font-semibold text-2xl text-ink mb-8 text-center">
            ورود ادمین
          </h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm text-ink mb-1.5 font-medium">ایمیل</label>
              <input
                type="text"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
                  fieldErrors.email ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
                }`}
              />
              {fieldErrors.email && <p className="text-wine text-xs mt-1.5">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-ink mb-1.5 font-medium">رمز عبور</label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                hasError={!!fieldErrors.password}
                autoComplete="current-password"
              />
              {fieldErrors.password && (
                <p className="text-wine text-xs mt-1.5">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-2.5 rounded-xl font-medium hover:bg-ink/90 transition-colors active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>

        <div className="mt-10 pt-6 border-t border-ink/10 text-center">
          <p className="text-muted text-xs leading-relaxed max-w-xs mx-auto">
            این سامانه ابزاری ساده برای ساخت منوی دیجیتال رستوران و کافه‌ست؛ منوی خودتون
            رو بسازید، از آن QR کد بگیرید و هر وقت خواستید به‌روزش کنید. تغییرات همان
            لحظه برای مشتری نمایش داده می‌شود.
          </p>
          <a
            href="https://t.me/sina_ij"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-gold hover:underline mt-3"
          >
            پشتیبانی و ارتباط با ما در تلگرام: @sina_ij
          </a>
        </div>
      </div>
      <Toast toast={toast} onDismiss={dismissToast} />
    </AuthBackground>
  );
}
