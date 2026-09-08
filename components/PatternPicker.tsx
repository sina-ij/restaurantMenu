"use client";

import { Check } from "@phosphor-icons/react";
import { PATTERNS, DEFAULT_PATTERN, type PatternDef } from "@/lib/patterns";

const GROUPS: PatternDef["group"][] = ["سنتی", "کافه و مدرن", "ساده"];

export function PatternPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string) => void;
}) {
  const current = value || DEFAULT_PATTERN;
  return (
    <div className="space-y-4">
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="mb-2 text-xs text-muted">{group}</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {PATTERNS.filter((p) => p.group === group).map((p) => {
              const selected = current === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange(p.id)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-colors ${
                    selected ? "border-gold bg-gold/5" : "border-ink/15 hover:border-gold/50"
                  }`}
                  title={p.label}
                >
                  <span
                    className="h-12 w-full rounded-lg border border-ink/10 bg-paper"
                    style={
                      p.id === "none"
                        ? undefined
                        : { backgroundImage: p.backgroundImage, backgroundSize: p.backgroundSize }
                    }
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-ink">{p.label}</span>
                  {selected && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-paper ring-2 ring-card">
                      <Check className="h-2.5 w-2.5" weight="bold" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
