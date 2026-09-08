"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

export function PasswordInput({
  value,
  onChange,
  placeholder,
  hasError,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        dir="ltr"
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-xl ps-10 pe-4 py-2.5 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
          hasError ? "border-wine ring-wine/20" : "border-ink/20 focus:ring-gold/40"
        }`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
        aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
        tabIndex={-1}
      >
        {visible ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
