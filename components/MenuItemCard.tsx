"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeWidth={1.5} strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MenuItemCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const canExpand = Boolean(item.imageUrl || item.description);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => canExpand && setOpen(true)}
        className={`w-full flex gap-4 items-start bg-card rounded-lg p-3.5 border border-ink/5 shadow-soft text-start relative overflow-hidden ${
          canExpand ? "hover:shadow-lift transition-shadow active:scale-[0.99]" : "cursor-default"
        }`}
      >
        <span className="absolute inset-y-0 right-0 w-1 bg-gold/60" aria-hidden="true" />
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline gap-3">
            <h3 className="font-body font-semibold text-ink">{item.name}</h3>
            <span className="font-body font-medium text-gold whitespace-nowrap tabular-nums">
              {formatPrice(item.price)} تومان
            </span>
          </div>
          {item.description && (
            <p className="text-muted text-sm mt-1 leading-relaxed line-clamp-2">{item.description}</p>
          )}
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-card w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-lift overflow-hidden animate-toast-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full bg-ink/40 text-paper flex items-center justify-center hover:bg-ink/60 transition-colors"
              aria-label="بستن"
            >
              <CloseIcon />
            </button>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-full h-56 object-cover" />
            )}
            <div className="p-5">
              <div className="flex justify-between items-baseline gap-3 mb-2">
                <h3 className="font-display font-semibold text-xl text-ink">{item.name}</h3>
                <span className="font-body font-semibold text-gold whitespace-nowrap tabular-nums">
                  {formatPrice(item.price)} تومان
                </span>
              </div>
              {item.description && (
                <p className="text-muted text-sm leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
