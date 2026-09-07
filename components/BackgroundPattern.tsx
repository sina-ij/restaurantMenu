export function BackgroundPattern({ opacity = 0.6 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        opacity,
        backgroundImage:
          "repeating-linear-gradient(45deg, rgb(var(--color-ink) / 5%) 0, rgb(var(--color-ink) / 5%) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(-45deg, rgb(var(--color-ink) / 5%) 0, rgb(var(--color-ink) / 5%) 1px, transparent 1px, transparent 18px)",
      }}
      aria-hidden="true"
    />
  );
}
