"use client";

import { ACCENT_COLORS } from "@/lib/color";

export function AccentColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {ACCENT_COLORS.map((c) => {
        const selected = c.hex.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={c.hex}
            type="button"
            onClick={() => onChange(c.hex)}
            className={`relative h-9 w-9 rounded-full transition-transform ${
              selected ? "ring-2 ring-offset-2 ring-ink scale-105" : "hover:scale-105"
            }`}
            style={{ backgroundColor: c.hex }}
            aria-label={c.label}
            title={c.label}
          >
            {selected && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                className="absolute inset-0 m-auto h-4 w-4"
              >
                <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
