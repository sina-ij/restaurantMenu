// بافت پس‌زمینه‌ی نرم و اشتهاآور: به‌جای خطوط ضربدریِ crosshair (که یک تلِ
// طراحیِ ماشینی است) از یک دانه‌بندیِ نقطه‌ایِ خیلی ملایم استفاده می‌کنیم که
// روی یک لایه‌ی ثابتِ pointer-events-none نشسته تا FPS موبایل آسیب نبیند.
export function BackgroundPattern({ opacity = 0.6 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        opacity,
        backgroundImage:
          "radial-gradient(rgb(var(--color-ink) / 6%) 0.9px, transparent 0.9px)",
        backgroundSize: "22px 22px",
        maskImage:
          "radial-gradient(120% 100% at 50% 0%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(120% 100% at 50% 0%, black 55%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}
