"use client";

import { useState } from "react";

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
        className={`w-full border rounded-md ps-10 pe-4 py-2.5 bg-white text-left focus:outline-none focus:ring-2 transition-shadow ${
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
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
      />
      <circle cx="12" cy="12" r="3" strokeWidth={1.5} />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-3.1 3.9M6.2 6.2C3.7 7.9 2 10.5 2 12s3.5 7 10 7c1.3 0 2.5-.2 3.6-.6"
      />
    </svg>
  );
}
