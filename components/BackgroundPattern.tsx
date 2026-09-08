import { getPattern } from "@/lib/patterns";

// پس‌زمینه‌ی نرمِ منو: طرحِ انتخابیِ رستوران (یا نقطه‌چینِ پیش‌فرض) را روی یک
// لایه‌ی ثابتِ pointer-events-none نمایش می‌دهد تا FPS موبایل آسیب نبیند.
export function BackgroundPattern({
  opacity = 0.6,
  pattern,
}: {
  opacity?: number;
  pattern?: string | null;
}) {
  const p = getPattern(pattern);
  if (p.id === "none") return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        opacity,
        backgroundImage: p.backgroundImage,
        backgroundSize: p.backgroundSize,
        maskImage:
          "radial-gradient(140% 100% at 50% 0%, black 60%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(140% 100% at 50% 0%, black 60%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}
