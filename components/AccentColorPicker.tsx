"use client";

import { Check } from "@phosphor-icons/react";
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
              <Check className="absolute inset-0 m-auto h-4 w-4 text-white" weight="bold" />
            )}
          </button>
        );
      })}
    </div>
  );
}
