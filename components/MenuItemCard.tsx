"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "@phosphor-icons/react";

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

export function MenuItemCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
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
      <motion.button
        type="button"
        onClick={() => canExpand && setOpen(true)}
        whileTap={canExpand && !reduce ? { scale: 0.985 } : undefined}
        className={`relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border border-ink/5 bg-card p-3.5 text-start shadow-soft ${
          canExpand ? "transition-shadow hover:shadow-lift" : "cursor-default"
        }`}
      >
        <span className="absolute inset-y-0 right-0 w-1 bg-gold/60" aria-hidden="true" />
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-body font-semibold text-ink">{item.name}</h3>
            <span className="whitespace-nowrap font-body font-medium tabular-nums text-gold">
              {formatPrice(item.price)} تومان
            </span>
          </div>
          {item.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>
          )}
        </div>
      </motion.button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="relative w-full overflow-hidden rounded-t-2xl bg-card shadow-lift sm:max-w-md sm:rounded-2xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/40 text-paper transition-colors hover:bg-ink/60"
              aria-label="بستن"
            >
              <X className="h-5 w-5" weight="bold" />
            </button>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="h-56 w-full object-cover" />
            )}
            <div className="p-5">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">{item.name}</h3>
                <span className="whitespace-nowrap font-body font-semibold tabular-nums text-gold">
                  {formatPrice(item.price)} تومان
                </span>
              </div>
              {item.description && (
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
