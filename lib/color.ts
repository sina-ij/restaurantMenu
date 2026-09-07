export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num) || full.length !== 6) return "171 124 51";
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export const ACCENT_COLORS = [
  { label: "طلایی", hex: "#AB7C33" },
  { label: "زرشکی", hex: "#7A2B33" },
  { label: "سفالی", hex: "#B5502F" },
  { label: "سبز جنگلی", hex: "#4B6B4F" },
  { label: "آبی سرمه‌ای", hex: "#35577A" },
  { label: "بنفش", hex: "#6B4E9E" },
  { label: "سبز آبی", hex: "#2F6B69" },
  { label: "رز", hex: "#B15C71" },
] as const;

export const BUSINESS_TYPES = [
  "رستوران",
  "کافه",
  "کافه‌رستوران",
  "فست‌فود",
  "قهوه‌خانه",
  "شیرینی و کیک",
  "آبمیوه و بستنی",
] as const;
