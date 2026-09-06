export function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper flex items-center justify-center px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(34,26,19,0.045) 0, rgba(34,26,19,0.045) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(-45deg, rgba(34,26,19,0.045) 0, rgba(34,26,19,0.045) 1px, transparent 1px, transparent 18px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-28 -right-20 h-80 w-80 rounded-full bg-gold/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-wine/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative w-full">{children}</div>
    </main>
  );
}
