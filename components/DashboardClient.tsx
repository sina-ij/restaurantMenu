"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [menuUrl, setMenuUrl] = useState("");

  useState(() => {
    if (typeof window !== "undefined") {
      setMenuUrl(`${window.location.origin}/menu/${restaurant.slug}`);
    }
  });

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });
    const data = await res.json();
    if (res.ok) {
      setCategories([...categories, { ...data, items: [] }]);
      setNewCategoryName("");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("این دسته و همه‌ی آیتم‌های داخلش حذف بشه؟")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories(categories.filter((c) => c.id !== id));
  }

  async function addItem(
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ) {
    const res = await fetch("/api/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, categoryId }),
    });
    const data = await res.json();
    if (res.ok) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId ? { ...c, items: [...c.items, data] } : c
        )
      );
    }
    return res.ok;
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
    }
  }

  async function deleteItem(itemId: string, categoryId: string) {
    if (!confirm("این آیتم حذف بشه؟")) return;
    const res = await fetch(`/api/menu-items/${itemId}`, { method: "DELETE" });
    if (res.ok) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
            : c
        )
      );
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-10 max-w-3xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-ink/10">
        <div>
          <h1 className="font-display text-2xl text-ink">{restaurant.name}</h1>
          <p className="text-muted text-sm mt-1 break-all">{menuUrl}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => menuUrl && navigator.clipboard.writeText(menuUrl)}
            className="text-sm border border-ink/20 px-4 py-2 rounded-sm hover:bg-ink/5"
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

      <form onSubmit={addCategory} className="flex gap-2 mb-10">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="نام دسته‌ی جدید (مثلاً: نوشیدنی گرم)"
          className="flex-1 border border-ink/20 rounded-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-saffron/50"
        />
        <button
          type="submit"
          className="bg-ink text-paper px-5 py-2 rounded-sm hover:bg-ink/90"
        >
          افزودن دسته
        </button>
      </form>

      <div className="space-y-10">
        {categories.map((cat) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            onAddItem={addItem}
            onToggle={toggleAvailable}
            onDeleteItem={deleteItem}
            onDeleteCategory={deleteCategory}
          />
        ))}
        {categories.length === 0 && (
          <p className="text-muted text-center py-10">
            هنوز دسته‌بندی‌ای اضافه نکردید. از فرم بالا شروع کنید.
          </p>
        )}
      </div>
    </main>
  );
}

function CategoryBlock({
  category,
  onAddItem,
  onToggle,
  onDeleteItem,
  onDeleteCategory,
}: {
  category: Category;
  onAddItem: (
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ) => Promise<boolean>;
  onToggle: (item: MenuItem, categoryId: string) => void;
  onDeleteItem: (itemId: string, categoryId: string) => void;
  onDeleteCategory: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setImageUrl(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setSaving(true);
    const ok = await onAddItem(category.id, { name, description, price, imageUrl });
    setSaving(false);
    if (ok) {
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setShowForm(false);
    }
  }

  return (
    <section className="border border-ink/10 rounded-md p-5 bg-white/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl text-ink">{category.name}</h2>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm text-saffron hover:underline"
          >
            {showForm ? "بستن" : "+ افزودن آیتم"}
          </button>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="text-sm text-muted hover:text-red-600"
          >
            حذف دسته
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-paper border border-ink/10 rounded-sm p-4 mb-4 space-y-3"
        >
          <input
            type="text"
            placeholder="نام آیتم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white"
          />
          <textarea
            placeholder="توضیحات (اختیاری)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white"
          />
          <input
            type="number"
            placeholder="قیمت (تومان)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            className="w-full border border-ink/20 rounded-sm px-3 py-2 bg-white"
          />
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {uploading && <p className="text-sm text-muted mt-1">در حال آپلود...</p>}
            {imageUrl && (
              <img src={imageUrl} alt="پیش‌نمایش" className="w-16 h-16 rounded-sm object-cover mt-2" />
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper px-5 py-2 rounded-sm hover:bg-ink/90 disabled:opacity-60"
          >
            {saving ? "در حال ذخیره..." : "ذخیره آیتم"}
          </button>
        </form>
      )}

      <ul className="divide-y divide-ink/10">
        {category.items.map((item) => (
          <li key={item.id} className="py-3 flex items-center gap-3">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-sm object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-ink font-medium">{item.name}</p>
              <p className="text-muted text-sm">
                {new Intl.NumberFormat("fa-IR").format(item.price)} تومان
              </p>
            </div>
            <button
              onClick={() => onToggle(item, category.id)}
              className={`text-xs px-3 py-1 rounded-full border ${
                item.available
                  ? "border-olive text-olive"
                  : "border-muted text-muted"
              }`}
            >
              {item.available ? "موجود" : "ناموجود"}
            </button>
            <button
              onClick={() => onDeleteItem(item.id, category.id)}
              className="text-muted hover:text-red-600 text-sm"
            >
              حذف
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
