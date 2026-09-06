"use client";

import { useCallback, useEffect, useState } from "react";

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
        className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 shadow-lift text-sm font-medium text-paper animate-toast-in ${
          toast.type === "success" ? "bg-olive" : "bg-wine"
        }`}
      >
        {toast.type === "success" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 flex-shrink-0">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 flex-shrink-0">
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
