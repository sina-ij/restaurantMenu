"use client";

import { useEffect, useState } from "react";
import { Toast, useToast } from "@/components/Toast";
import { BUSINESS_TYPES } from "@/lib/color";

type Owner = {
  id: string;
  email: string;
  restaurantName: string | null;
  restaurantSlug: string | null;
};

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

export default function SuperAdminPanel() {
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const { toast, showToast, dismissToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [creating, setCreating] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function loadOwners() {
    const res = await fetch("/api/super/owners");
    const data = await parseResponse(res);
    if (res.ok) setOwners(data);
  }

  useEffect(() => {
    loadOwners();
  }, []);

  function handleNameChange(value: string) {
    setRestaurantName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "ایمیل را وارد کنید";
    if (!password) errors.password = "رمز عبور را وارد کنید";
    else if (password.length < 6) errors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    if (!restaurantName.trim()) errors.restaurantName = "نام رستوران را وارد کنید";
    if (!slug.trim()) errors.slug = "آدرس منو را وارد کنید";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setCreating(true);
    const res = await fetch("/api/super/owners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, restaurantName, slug, businessType }),
    });
    const data = await parseResponse(res);
    setCreating(false);

    if (res.ok) {
      showToast("رستوران‌دار جدید ساخته شد", "success");
      setEmail("");
      setPassword("");
      setRestaurantName("");
      setSlug("");
      setSlugTouched(false);
      setBusinessType("");
      loadOwners();
    } else {
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  async function handlePasswordReset(userId: string, newPassword: string) {
    const res = await fetch(`/api/super/owners/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    const data = await parseResponse(res);
    if (res.ok) {
      showToast("رمز عبور بروزرسانی شد", "success");
    } else {
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  return (
    <main className="relative px-4 py-8 md:px-10 max-w-3xl mx-auto">
      <h1 className="font-display font-semibold text-2xl text-ink mb-8">مدیریت رستوران‌دارها</h1>

      <form
        onSubmit={handleCreate}
        noValidate
        className="bg-card border border-ink/10 rounded-2xl shadow-soft p-6 space-y-4 mb-10"
      >
        <h2 className="font-display font-semibold text-lg text-ink">افزودن رستوران‌دار جدید</h2>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">نام رستوران/کافه</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="کافه گلستان"
            className={`w-full border rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 transition-shadow ${
              fieldErrors.restaurantName ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
            }`}
          />
          {fieldErrors.restaurantName && (
            <p className="text-wine text-xs mt-1.5">{fieldErrors.restaurantName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">نوع کسب‌وکار (اختیاری)</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full border border-ink/20 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            <option value="">انتخاب کنید</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">آدرس انگلیسی منو</label>
          <div
            className={`flex items-center border rounded-xl bg-white overflow-hidden focus-within:ring-2 transition-shadow ${
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
              className="flex-1 min-w-0 px-3 py-2 bg-white text-left focus:outline-none"
            />
          </div>
          {fieldErrors.slug && <p className="text-wine text-xs mt-1.5">{fieldErrors.slug}</p>}
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">ایمیل رستوران‌دار</label>
          <input
            type="text"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@example.com"
            className={`w-full border rounded-xl px-4 py-2 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
              fieldErrors.email ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
            }`}
          />
          {fieldErrors.email && <p className="text-wine text-xs mt-1.5">{fieldErrors.email}</p>}
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">رمز عبور</label>
          <input
            type="text"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="حداقل ۶ کاراکتر"
            className={`w-full border rounded-xl px-4 py-2 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
              fieldErrors.password ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
            }`}
          />
          {fieldErrors.password && <p className="text-wine text-xs mt-1.5">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={creating}
          className="bg-ink text-paper px-5 py-2 rounded-xl hover:bg-ink/90 transition-colors disabled:opacity-60"
        >
          {creating ? "در حال ساخت..." : "ساخت رستوران‌دار"}
        </button>
      </form>

      <h2 className="font-display font-semibold text-lg text-ink mb-4">رستوران‌دارهای فعلی</h2>
      <div className="space-y-3">
        {owners?.map((owner) => (
          <OwnerRow key={owner.id} owner={owner} onResetPassword={handlePasswordReset} />
        ))}
        {owners?.length === 0 && (
          <p className="text-muted text-sm text-center py-8">هنوز رستوران‌داری اضافه نشده.</p>
        )}
        {owners === null && <p className="text-muted text-sm text-center py-8">در حال بارگذاری...</p>}
      </div>
      <Toast toast={toast} onDismiss={dismissToast} />
    </main>
  );
}

function OwnerRow({
  owner,
  onResetPassword,
}: {
  owner: Owner;
  onResetPassword: (userId: string, newPassword: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) return;
    setSaving(true);
    await onResetPassword(owner.id, newPassword);
    setSaving(false);
    setNewPassword("");
    setOpen(false);
  }

  return (
    <div className="bg-card border border-ink/10 rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink font-medium truncate">{owner.restaurantName ?? "بدون رستوران"}</p>
          <p className="text-muted text-sm truncate" dir="ltr">
            {owner.email}
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-gold hover:underline flex-shrink-0"
        >
          {open ? "بستن" : "تغییر رمز عبور"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
          <input
            type="text"
            dir="ltr"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="رمز عبور جدید (حداقل ۶ کاراکتر)"
            className="flex-1 border border-ink/20 rounded-xl px-3 py-1.5 bg-white text-left text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <button
            type="submit"
            disabled={saving || newPassword.length < 6}
            className="bg-ink text-paper px-4 py-1.5 rounded-xl text-sm hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            {saving ? "..." : "ذخیره"}
          </button>
        </form>
      )}
    </div>
  );
}
