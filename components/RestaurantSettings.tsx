"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/Toast";

export type RestaurantInfo = {
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  address: string | null;
  workingHours: string | null;
  locationUrl: string | null;
};

async function parseResponse(res: Response) {
  try {
    return await res.json();
  } catch {
    return { error: "پاسخ سرور نامعتبر بود" };
  }
}

export default function RestaurantSettings({ restaurant }: { restaurant: RestaurantInfo }) {
  const router = useRouter();
  const { toast, showToast, dismissToast } = useToast();
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description ?? "");
  const [phone, setPhone] = useState(restaurant.phone ?? "");
  const [address, setAddress] = useState(restaurant.address ?? "");
  const [workingHours, setWorkingHours] = useState(restaurant.workingHours ?? "");
  const [locationUrl, setLocationUrl] = useState(restaurant.locationUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(restaurant.logoUrl ?? "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await parseResponse(res);
    setUploadingLogo(false);
    if (res.ok) {
      setLogoUrl(data.url);
    } else {
      showToast(data.error || "آپلود لوگو با خطا مواجه شد", "error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("نام رستوران/کافه الزامی است");
      return;
    }
    setNameError("");
    setSaving(true);
    const res = await fetch("/api/restaurant", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, phone, address, workingHours, locationUrl, logoUrl }),
    });
    const data = await parseResponse(res);
    setSaving(false);
    if (res.ok) {
      showToast("اطلاعات کافه ذخیره شد", "success");
      router.refresh();
    } else {
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  return (
    <main className="px-4 py-8 md:px-10 max-w-2xl mx-auto">
      <h1 className="font-display font-semibold text-2xl text-ink mb-8">اطلاعات کافه</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-card border border-ink/10 rounded-xl shadow-soft p-6 space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="لوگو" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-paper border border-ink/10 flex items-center justify-center text-muted text-xs">
                بدون لوگو
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-ink mb-1.5 font-medium">لوگوی کافه</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
            {uploadingLogo && <p className="text-sm text-muted mt-1">در حال آپلود...</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">نام رستوران/کافه</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            className={`w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 transition-shadow ${
              nameError ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
            }`}
          />
          {nameError && <p className="text-wine text-xs mt-1.5">{nameError}</p>}
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="یک معرفی کوتاه از کافه/رستوران"
            className="w-full border border-ink/20 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">تلفن</label>
          <input
            type="text"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="021-xxxxxxx"
            className="w-full border border-ink/20 rounded-md px-4 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">آدرس</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="آدرس کامل کافه/رستوران"
            className="w-full border border-ink/20 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">ساعت کاری</label>
          <input
            type="text"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="مثلاً: هر روز ۹ صبح تا ۱۱ شب"
            className="w-full border border-ink/20 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-sm text-ink mb-1.5 font-medium">لینک لوکیشن (گوگل مپ)</label>
          <input
            type="text"
            dir="ltr"
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full border border-ink/20 rounded-md px-4 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-paper px-5 py-2 rounded-md hover:bg-ink/90 transition-colors disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
        </button>
      </form>
      <Toast toast={toast} onDismiss={dismissToast} />
    </main>
  );
}
