"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Toast, useToast } from "@/components/Toast";
import { downloadMenuQrCode } from "@/lib/qrDownload";

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
  imageUrl: string | null;
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
  slug,
  initialCategories,
}: {
  slug: string;
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [menuUrl, setMenuUrl] = useState("");
  const [generatingQr, setGeneratingQr] = useState(false);
  const { toast, showToast, dismissToast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useState(() => {
    if (typeof window !== "undefined") {
      setMenuUrl(`${window.location.origin}/menu/${slug}`);
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

  async function renameCategory(id: string, name: string): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories(categories.map((c) => (c.id === id ? { ...c, name: data.name } : c)));
      showToast("نام دسته بروزرسانی شد", "success");
      return { ok: true };
    }
    return { ok: false, error: data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید" };
  }

  async function updateCategoryImage(categoryId: string, imageUrl: string) {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories(categories.map((c) => (c.id === categoryId ? { ...c, imageUrl: data.imageUrl } : c)));
      showToast("عکس دسته بروزرسانی شد", "success");
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

  async function updateItem(
    itemId: string,
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ): Promise<{ ok: boolean; error?: string }> {
    const res = await fetch(`/api/menu-items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await parseResponse(res);
    if (res.ok) {
      setCategories(
        categories.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.map((i) => (i.id === itemId ? data : i)) }
            : c
        )
      );
      showToast("آیتم بروزرسانی شد", "success");
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

  async function persistCategoryOrder(ids: string[]) {
    const res = await fetch("/api/categories/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      const data = await parseResponse(res);
      showToast(data.error || "ترتیب دسته‌ها ذخیره نشد", "error");
      setCategories(initialCategories);
    }
  }

  function handleCategoryDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setCategories((current) => {
      const oldIndex = current.findIndex((c) => c.id === active.id);
      const newIndex = current.findIndex((c) => c.id === over.id);
      const reordered = arrayMove(current, oldIndex, newIndex);
      persistCategoryOrder(reordered.map((c) => c.id));
      return reordered;
    });
  }

  async function persistItemOrder(categoryId: string, ids: string[]) {
    const res = await fetch("/api/menu-items/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, ids }),
    });
    if (!res.ok) {
      const data = await parseResponse(res);
      showToast(data.error || "ترتیب آیتم‌ها ذخیره نشد", "error");
    }
  }

  function reorderItems(categoryId: string, oldIndex: number, newIndex: number) {
    setCategories((current) =>
      current.map((c) => {
        if (c.id !== categoryId) return c;
        const reordered = arrayMove(c.items, oldIndex, newIndex);
        persistItemOrder(categoryId, reordered.map((i) => i.id));
        return { ...c, items: reordered };
      })
    );
  }

  function copyMenuUrl() {
    if (!menuUrl) return;
    navigator.clipboard.writeText(menuUrl);
    showToast("لینک منو کپی شد", "success");
  }

  async function downloadQrCode() {
    if (!menuUrl) return;
    setGeneratingQr(true);
    try {
      await downloadMenuQrCode(menuUrl, slug);
    } catch (err) {
      console.error("qr code generation error:", err);
      showToast("ساخت QR کد با خطا مواجه شد", "error");
    } finally {
      setGeneratingQr(false);
    }
  }

  return (
    <main className="relative px-4 py-8 md:px-10 max-w-3xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-ink/10">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink">منو و دسته‌بندی‌ها</h1>
          <p className="text-muted text-sm mt-1 break-all" dir="ltr">
            {menuUrl}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={downloadQrCode}
            disabled={generatingQr}
            className="text-sm border border-ink/20 px-4 py-2 rounded-md hover:bg-ink/5 transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            <QrIcon />
            {generatingQr ? "در حال ساخت..." : "دانلود QR کد"}
          </button>
          <button
            onClick={copyMenuUrl}
            className="text-sm border border-ink/20 px-4 py-2 rounded-md hover:bg-ink/5 transition-colors"
          >
            کپی لینک منو
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

      {categories.length === 0 ? (
        <p className="text-muted text-center py-10">
          هنوز دسته‌بندی‌ای اضافه نکردید. از فرم بالا شروع کنید.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {categories.map((cat) => (
                <SortableCategoryBlock
                  key={cat.id}
                  category={cat}
                  onAddItem={addItem}
                  onEditItem={updateItem}
                  onToggle={toggleAvailable}
                  onDeleteItem={deleteItem}
                  onDeleteCategory={deleteCategory}
                  onUpdateImage={updateCategoryImage}
                  onRenameCategory={renameCategory}
                  onReorderItems={reorderItems}
                  sensors={sensors}
                  showToast={showToast}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
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

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
      />
      <circle cx="12" cy="13" r="3.2" strokeWidth={1.5} />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <rect x="3" y="3" width="7" height="7" strokeWidth={1.5} rx="1" />
      <rect x="14" y="3" width="7" height="7" strokeWidth={1.5} rx="1" />
      <rect x="3" y="14" width="7" height="7" strokeWidth={1.5} rx="1" />
      <path strokeWidth={1.5} strokeLinecap="round" d="M14 14h3m4 0h0M14 18h3m-3 3h7v-4" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.5 4.5 3 3L8 19H5v-3L16.5 4.5Z"
      />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <circle cx="9" cy="6" r="1.4" />
      <circle cx="15" cy="6" r="1.4" />
      <circle cx="9" cy="12" r="1.4" />
      <circle cx="15" cy="12" r="1.4" />
      <circle cx="9" cy="18" r="1.4" />
      <circle cx="15" cy="18" r="1.4" />
    </svg>
  );
}

function SortableCategoryBlock(
  props: React.ComponentProps<typeof CategoryBlock> & { sensors: ReturnType<typeof useSensors> }
) {
  const { category, sensors, ...rest } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CategoryBlock
        category={category}
        sensors={sensors}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
        {...rest}
      />
    </div>
  );
}

function CategoryBlock({
  category,
  onAddItem,
  onEditItem,
  onToggle,
  onDeleteItem,
  onDeleteCategory,
  onUpdateImage,
  onRenameCategory,
  onReorderItems,
  sensors,
  showToast,
  dragHandleAttributes,
  dragHandleListeners,
}: {
  category: Category;
  onAddItem: (
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  onEditItem: (
    itemId: string,
    categoryId: string,
    item: { name: string; description: string; price: string; imageUrl: string }
  ) => Promise<{ ok: boolean; error?: string }>;
  onToggle: (item: MenuItem, categoryId: string) => void;
  onDeleteItem: (itemId: string, categoryId: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateImage: (categoryId: string, imageUrl: string) => void;
  onRenameCategory: (id: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  onReorderItems: (categoryId: string, oldIndex: number, newIndex: number) => void;
  sensors: ReturnType<typeof useSensors>;
  showToast: (message: string, type?: "success" | "error") => void;
  dragHandleAttributes?: ReturnType<typeof useSortable>["attributes"];
  dragHandleListeners?: ReturnType<typeof useSortable>["listeners"];
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; price?: string }>({});
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(category.name);
  const [savingName, setSavingName] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  async function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameDraft.trim()) return;
    setSavingName(true);
    const result = await onRenameCategory(category.id, nameDraft.trim());
    setSavingName(false);
    if (result.ok) {
      setEditingName(false);
    } else {
      showToast(result.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

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

  async function handleCategoryImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCategoryImage(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await parseResponse(res);
    setUploadingCategoryImage(false);
    if (res.ok) {
      onUpdateImage(category.id, data.url);
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

  function handleItemDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = category.items.findIndex((i) => i.id === active.id);
    const newIndex = category.items.findIndex((i) => i.id === over.id);
    onReorderItems(category.id, oldIndex, newIndex);
  }

  return (
    <section className="border border-ink/10 rounded-xl p-5 bg-card shadow-soft">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-muted hover:text-ink cursor-grab active:cursor-grabbing touch-none"
            aria-label="جابه‌جایی دسته"
            {...dragHandleAttributes}
            {...dragHandleListeners}
          >
            <GripIcon />
          </button>
          <label className="relative flex-shrink-0 cursor-pointer group">
            {category.imageUrl ? (
              <img src={category.imageUrl} alt={category.name} className="w-10 h-10 rounded-md object-cover" />
            ) : (
              <span className="flex w-10 h-10 rounded-md bg-paper border border-ink/10 items-center justify-center text-muted group-hover:text-gold transition-colors">
                <CameraIcon />
              </span>
            )}
            <input type="file" accept="image/*" onChange={handleCategoryImageChange} className="hidden" />
          </label>
          {editingName ? (
            <form onSubmit={handleRenameSubmit} className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="border border-ink/20 rounded-md px-2 py-1 bg-white text-xl font-display font-semibold focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="submit"
                disabled={savingName}
                className="text-xs text-gold hover:underline font-medium disabled:opacity-60"
              >
                ذخیره
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingName(false);
                  setNameDraft(category.name);
                }}
                className="text-xs text-muted hover:text-ink"
              >
                انصراف
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-xl text-ink">{category.name}</h2>
              <button
                type="button"
                onClick={() => {
                  setNameDraft(category.name);
                  setEditingName(true);
                }}
                className="text-muted hover:text-gold transition-colors"
                aria-label="ویرایش نام دسته"
              >
                <PencilIcon />
              </button>
            </div>
          )}
          {uploadingCategoryImage && <span className="text-xs text-muted">در حال آپلود...</span>}
        </div>
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

      {category.items.length === 0 ? (
        !showForm && <p className="text-muted text-sm py-3">آیتمی در این دسته نیست.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
          <SortableContext items={category.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <ul className="divide-y divide-ink/10">
              {category.items.map((item) =>
                editingItemId === item.id ? (
                  <li key={item.id} className="py-3">
                    <ItemEditForm
                      item={item}
                      onSave={(data) => onEditItem(item.id, category.id, data)}
                      onCancel={() => setEditingItemId(null)}
                      showToast={showToast}
                    />
                  </li>
                ) : (
                  <SortableItemRow
                    key={item.id}
                    item={item}
                    onToggle={() => onToggle(item, category.id)}
                    onEdit={() => setEditingItemId(item.id)}
                    onDelete={() => onDeleteItem(item.id, category.id)}
                  />
                )
              )}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}

function SortableItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="py-3 flex items-center gap-3 bg-card">
      <button
        type="button"
        className="text-muted hover:text-ink cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
        aria-label="جابه‌جایی آیتم"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
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
        onClick={onToggle}
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
          item.available
            ? "border-olive/40 text-olive bg-olive/5"
            : "border-muted/40 text-muted"
        }`}
      >
        {item.available ? "موجود" : "ناموجود"}
      </button>
      <button
        onClick={onEdit}
        className="text-muted hover:text-gold transition-colors"
        aria-label="ویرایش آیتم"
      >
        <PencilIcon />
      </button>
      <button
        onClick={onDelete}
        className="text-muted hover:text-wine transition-colors"
        aria-label="حذف آیتم"
      >
        <TrashIcon />
      </button>
    </li>
  );
}

function ItemEditForm({
  item,
  onSave,
  onCancel,
  showToast,
}: {
  item: MenuItem;
  onSave: (data: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  onCancel: () => void;
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [price, setPrice] = useState(String(item.price));
  const [imageUrl, setImageUrl] = useState(item.imageUrl ?? "");
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
    const result = await onSave({ name: name.trim(), description: description.trim(), price, imageUrl });
    setSaving(false);
    if (result.ok) {
      onCancel();
    } else {
      showToast(result.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید", "error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-paper border border-ink/10 rounded-lg p-4 space-y-3"
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-paper px-5 py-2 rounded-md hover:bg-ink/90 transition-colors disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted hover:text-ink px-3"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
