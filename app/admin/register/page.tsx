"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "خطایی رخ داد");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-ink mb-2 text-center">
          ساخت حساب رستوران
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          چند ثانیه‌ای منوی دیجیتال خودتون رو راه بندازید
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink mb-1">نام رستوران/کافه</label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="کافه گلستان"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">ایمیل</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">رمز عبور</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 rounded-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
              placeholder="حداقل ۶ کاراکتر"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-2.5 rounded-sm hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            {loading ? "در حال ساخت..." : "ساخت حساب"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          قبلاً حساب دارید؟{" "}
          <Link href="/admin/login" className="text-saffron hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </main>
  );
}
