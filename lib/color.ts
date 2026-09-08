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

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num) || full.length !== 6) return [171, 124, 51];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// رنگِ accent را به سمتِ یک رنگِ هدف (سفید یا مشکیِ گرم) با وزنِ w [0..1] مخلوط می‌کند.
function mix(hex: string, target: [number, number, number], w: number): string {
  const [r, g, b] = parseHex(hex);
  const R = Math.round(r * (1 - w) + target[0] * w);
  const G = Math.round(g * (1 - w) + target[1] * w);
  const B = Math.round(b * (1 - w) + target[2] * w);
  return `${R} ${G} ${B}`;
}

const WHITE: [number, number, number] = [255, 255, 255];
const WARM_DARK: [number, number, number] = [22, 18, 15];

// CSS متغیرهایی می‌سازد که کلِ منوی سمتِ کاربر را با هیوِ رنگِ انتخابیِ رستوران
// هماهنگ می‌کند (پس‌زمینه، کارت و accent) و در هر دو حالتِ روز/شب خوانا می‌ماند.
// در یک <style> تزریق می‌شود چون هر صفحه‌ی منو مختصِّ یک رستوران است.
export function menuThemeStyle(hex: string): string {
  const light = {
    gold: hexToRgbTriplet(hex),
    paper: mix(hex, WHITE, 0.9),
    card: mix(hex, WHITE, 0.965),
  };
  const dark = {
    gold: mix(hex, WHITE, 0.32),
    paper: mix(hex, WARM_DARK, 0.86),
    card: mix(hex, WARM_DARK, 0.8),
  };
  return (
    `:root{--color-gold:${light.gold};--color-paper:${light.paper};--color-card:${light.card};}` +
    `html.dark{--color-gold:${dark.gold};--color-paper:${dark.paper};--color-card:${dark.card};}`
  );
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
