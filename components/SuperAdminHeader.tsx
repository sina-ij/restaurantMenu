"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SuperAdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <span className="font-display font-semibold text-ink">پنل ادمین اصلی</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-sm text-wine hover:bg-wine/5 px-3 py-1.5 rounded-xl transition-colors"
          >
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}
