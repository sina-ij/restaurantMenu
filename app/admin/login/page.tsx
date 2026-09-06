"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const errors: Partial<Record<Field, string>> = {};
    if (!email.trim()) errors.email = "ایمیل را وارد کنید";
    if (!password) errors.password = "رمز عبور را وارد کنید";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
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
        setFormError(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setFormError("ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید");
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
                className={`w-full border rounded-md px-4 py-2.5 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
                  fieldErrors.email ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
                }`}
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
              />
              {fieldErrors.password && (
                <p className="text-wine text-xs mt-1.5">{fieldErrors.password}</p>
              )}
            </div>

            {formError && (
              <p className="text-wine text-sm bg-wine/5 border border-wine/20 rounded-md px-3 py-2">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-2.5 rounded-md font-medium hover:bg-ink/90 transition-colors disabled:opacity-60"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          حساب ندارید؟{" "}
          <Link href="/admin/register" className="text-gold hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </main>
  );
}
