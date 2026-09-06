"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast, useToast } from "@/components/Toast";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};

async function parseResponse(res: Response) {
  try {
    return await res.json();
  } catch {
    return { error: "پاسخ سرور نامعتبر بود" };
  }
}

export default function DashboardClient({
  restaurant,
  initialCategories,
}: {
  restaurant: { name: string; slug: string };
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const { toast, showToast, dismissToast } = useToast();

  useState(() => {
    if (typeof window !== "undefined") {
      setMenuUrl(`${window.location.origin}/menu/${restaurant.slug}`);
    }
  });

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setCategoryError("");
    if (!newCategoryName.trim()) {
      setCategoryError("نام دسته را وارد کنید");
      return;
    }

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories([...categories, { ...data, items: [] }]);
      setNewCategoryName("");
      showToast("دسته اضافه شد", "success");
    } else {
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("این دسته و همه‌ی آیتم‌های داخلش حذف بشه؟")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast("دسته حذف شد", "success");
    } else {
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  async function addItem(
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch("/api/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, categoryId }),
    });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId ? { ...c, items: [...c.items, data] } : c
        )
      );
      showToast("آیتم اضافه شد", "success");
      return { ok: true };
    }
    return { ok: false, error: data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید" };
  }

  async function toggleAvailable(item: MenuItem, categoryId: string) {
    const res = await fetch(`/api/menu-items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    if (res.ok) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === item.id ? { ...i, available: !i.available } : i
                ),
              }
            : c
        )
      );
    } else {
      const data = await parseResponse(res);
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  async function deleteItem(itemId: string, categoryId: string) {
    if (!confirm("این آیتم حذف بشه؟")) return;
    const res = await fetch(`/api/menu-items/${itemId}`, { method: "DELETE" });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
            : c
        )
      );
      showToast("آیتم حذف شد", "success");
    } else {
      showToast(data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function copyMenuUrl() {
    if (!menuUrl) return;
    navigator.clipboard.writeText(menuUrl);
    showToast("لینک منو کپی شد", "success");
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-10 max-w-3xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-ink/10">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">{restaurant.name}</h1>
          <p className="text-muted text-sm mt-1 break-all" dir="ltr">
            {menuUrl}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={copyMenuUrl}
            className="text-sm border border-ink/20 px-4 py-2 rounded-md hover:bg-ink/5 transition-colors"
          >
            کپی لینک منو
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-ink px-4 py-2"
          >
            خروج
          </button>
        </div>
      </header>

      <form onSubmit={addCategory} className="mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              if (categoryError) setCategoryError("");
            }}
            placeholder="نام دسته‌ی جدید (مثلاً: نوشیدنی گرم)"
            className={`flex-1 border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 transition-shadow ${
              categoryError ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
            }`}
          />
          <button
            type="submit"
            className="bg-ink text-paper px-5 py-2 rounded-md hover:bg-ink/90 transition-colors"
          >
            افزودن دسته
          </button>
        </div>
        {categoryError && <p className="text-wine text-xs mt-1.5">{categoryError}</p>}
      </form>

      <div className="space-y-6">
        {categories.map((cat) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            onAddItem={addItem}
            onToggle={toggleAvailable}
            onDeleteItem={deleteItem}
            onDeleteCategory={deleteCategory}
            showToast={showToast}
          />
        ))}
        {categories.length === 0 && (
          <p className="text-muted text-center py-10">
            هنوز دسته‌بندی‌ای اضافه نکردید. از فرم بالا شروع کنید.
          </p>
        )}
      </div>
      <Toast toast={toast} onDismiss={dismissToast} />
    </main>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path strokeWidth={1.5} strokeLinecap="round" d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7" />
    </svg>
  );
}

function CategoryBlock({
  category,
  onAddItem,
  onToggle,
  onDeleteItem,
  onDeleteCategory,
  showToast,
}: {
  category: Category;
  onAddItem: (
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  onToggle: (item: MenuItem, categoryId: string) => void;
  onDeleteItem: (itemId: string, categoryId: string) => void;
  onDeleteCategory: (id: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; price?: string }>({});

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await parseResponse(res);
    setUploading(false);
    if (res.ok) {
      setImageUrl(data.url);
    } else {
      showToast(data.error || "آپلود عکس با خطا مواجه شد", "error");
    }
  }

  function validate() {
    const errors: { name?: string; price?: string } = {};
    if (!name.trim()) errors.name = "نام آیتم را وارد کنید";
    const priceNum = Number(price);
    if (!price) {
      errors.price = "قیمت را وارد کنید";
    } else if (!Number.isFinite(priceNum) || priceNum < 0) {
      errors.price = "قیمت باید یک عدد معتبر باشد";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const result = await onAddItem(category.id, { name, description, price, imageUrl });
    setSaving(false);
    if (result.ok) {
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setFieldErrors({});
      setShowForm(false);
    } else {
      showToast(result.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  return (
    <section className="border border-ink/10 rounded-xl p-5 bg-card shadow-soft">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-semibold text-xl text-ink">{category.name}</h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm text-gold hover:underline font-medium"
          >
            {showForm ? "بستن" : "+ افزودن آیتم"}
          </button>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="text-sm text-muted hover:text-wine flex items-center gap-1"
          >
            <TrashIcon /> حذف دسته
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-paper border border-ink/10 rounded-lg p-4 mb-4 space-y-3"
        >
          <div>
            <input
              type="text"
              placeholder="نام آیتم"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
              }}
              className={`w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 transition-shadow ${
                fieldErrors.name ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
              }`}
            />
            {fieldErrors.name && <p className="text-wine text-xs mt-1">{fieldErrors.name}</p>}
          </div>
          <textarea
            placeholder="توضیحات (اختیاری)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border border-ink/20 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <div>
            <input
              type="number"
              placeholder="قیمت (تومان)"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: undefined });
              }}
              min={0}
              className={`w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 transition-shadow ${
                fieldErrors.price ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
              }`}
            />
            {fieldErrors.price && <p className="text-wine text-xs mt-1">{fieldErrors.price}</p>}
          </div>
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
            {uploading && <p className="text-sm text-muted mt-1">در حال آپلود...</p>}
            {imageUrl && (
              <img src={imageUrl} alt="پیش‌نمایش" className="w-16 h-16 rounded-md object-cover mt-2" />
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper px-5 py-2 rounded-md hover:bg-ink/90 transition-colors disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : "ذخیره آیتم"}
          </button>
        </form>
      )}

      <ul className="divide-y divide-ink/10">
        {category.items.map((item) => (
          <li key={item.id} className="py-3 flex items-center gap-3">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-ink font-medium">{item.name}</p>
              <p className="text-muted text-sm tabular-nums">
                {new Intl.NumberFormat("fa-IR").format(item.price)} تومان
              </p>
            </div>
            <button
              onClick={() => onToggle(item, category.id)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                item.available
                  ? "border-olive/40 text-olive bg-olive/5"
                  : "border-muted/40 text-muted"
              }`}
            >
              {item.available ? "موجود" : "ناموجود"}
            </button>
            <button
              onClick={() => onDeleteItem(item.id, category.id)}
              className="text-muted hover:text-wine transition-colors"
              aria-label="حذف آیتم"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
        {category.items.length === 0 && !showForm && (
          <p className="text-muted text-sm py-3">آیتمی در این دسته نیست.</p>
        )}
      </ul>
    </section>
  );
}
