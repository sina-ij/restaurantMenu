// طرح‌های پس‌زمینه‌ی قابل‌انتخاب برای منوی هر رستوران. همه بر پایه‌ی
// gradientهای CSS و رنگِ var(--color-ink) هستند تا در حالتِ روز و شب خودکار
// هماهنگ بمانند (بدون تصویرِ ثابت). ادمین یکی را از تنظیمات انتخاب می‌کند.

export type PatternDef = {
  id: string;
  label: string;
  group: "کافه و مدرن" | "سنتی" | "ساده";
  backgroundImage: string;
  backgroundSize: string;
};

const INK = "rgb(var(--color-ink) / 6%)";
const INK_SOFT = "rgb(var(--color-ink) / 4.5%)";

export const PATTERNS: PatternDef[] = [
  {
    id: "none",
    label: "بدون طرح",
    group: "ساده",
    backgroundImage: "none",
    backgroundSize: "auto",
  },
  {
    id: "dots",
    label: "نقطه‌چین",
    group: "کافه و مدرن",
    backgroundImage: `radial-gradient(${INK} 0.9px, transparent 0.9px)`,
    backgroundSize: "22px 22px",
  },
  {
    id: "grid",
    label: "شبکه",
    group: "کافه و مدرن",
    backgroundImage: `linear-gradient(${INK_SOFT} 1px, transparent 1px), linear-gradient(90deg, ${INK_SOFT} 1px, transparent 1px)`,
    backgroundSize: "26px 26px",
  },
  {
    id: "weave",
    label: "بافت",
    group: "کافه و مدرن",
    backgroundImage: `repeating-linear-gradient(45deg, ${INK_SOFT} 0 2px, transparent 2px 10px), repeating-linear-gradient(-45deg, ${INK_SOFT} 0 2px, transparent 2px 10px)`,
    backgroundSize: "20px 20px",
  },
  {
    id: "diamonds",
    label: "لوزی",
    group: "سنتی",
    backgroundImage: `repeating-linear-gradient(45deg, ${INK} 0 1px, transparent 1px 18px), repeating-linear-gradient(-45deg, ${INK} 0 1px, transparent 1px 18px)`,
    backgroundSize: "26px 26px",
  },
  {
    id: "crosshatch",
    label: "هاشور",
    group: "سنتی",
    backgroundImage: `repeating-linear-gradient(45deg, ${INK_SOFT} 0 1px, transparent 1px 7px)`,
    backgroundSize: "auto",
  },
  {
    id: "scallops",
    label: "پولکی",
    group: "سنتی",
    backgroundImage: `radial-gradient(circle at 50% 0, ${INK} 6px, transparent 6.5px), radial-gradient(circle at 0 100%, ${INK} 6px, transparent 6.5px), radial-gradient(circle at 100% 100%, ${INK} 6px, transparent 6.5px)`,
    backgroundSize: "28px 28px",
  },
];

export const DEFAULT_PATTERN = "dots";

export function getPattern(id: string | null | undefined): PatternDef {
  return PATTERNS.find((p) => p.id === (id || DEFAULT_PATTERN)) ?? PATTERNS[1];
}
