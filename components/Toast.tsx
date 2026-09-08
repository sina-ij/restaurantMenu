"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

type ToastType = "success" | "error";
type ToastData = { id: number; message: string; type: ToastType };

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "error") => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastData | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
      <div
        key={toast.id}
        role="status"
        className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 shadow-lift text-sm font-medium text-paper animate-toast-in ${
          toast.type === "success" ? "bg-olive" : "bg-wine"
        }`}
      >
        {toast.type === "success" ? (
          <CheckCircle className="h-5 w-5 flex-shrink-0" weight="fill" />
        ) : (
          <WarningCircle className="h-5 w-5 flex-shrink-0" weight="fill" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
