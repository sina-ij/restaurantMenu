import { BackgroundPattern } from "@/components/BackgroundPattern";

export function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper flex items-center justify-center px-6 py-12">
      <BackgroundPattern />
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
