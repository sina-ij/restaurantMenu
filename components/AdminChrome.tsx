"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeWidth={1.5} strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeWidth={1.5} strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <circle cx="12" cy="8" r="3.5" strokeWidth={1.5} />
      <path strokeWidth={1.5} strokeLinecap="round" d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" />
    </svg>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md text-ink/70 hover:bg-ink/5 transition-colors"
      aria-label={dark ? "حالت روشن" : "حالت تاریک"}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function UserMenu({ restaurantName }: { restaurantName: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-ink/5 text-ink/70 hover:bg-ink/10 transition-colors"
        aria-label="حساب کاربری"
      >
        <UserIcon />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-11 z-30 w-48 bg-card border border-ink/10 rounded-lg shadow-lift py-2">
            {restaurantName && (
              <p className="px-4 py-1.5 text-sm text-ink/80 border-b border-ink/10 mb-1 truncate">
                {restaurantName}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-right px-4 py-2 text-sm text-wine hover:bg-wine/5 transition-colors"
            >
              خروج
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminChrome({
  restaurant,
  children,
}: {
  restaurant: { name: string; slug: string; logoUrl: string | null } | null;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const navItems = restaurant
    ? [
        { href: "/admin/dashboard", label: "منو و دسته‌بندی‌ها" },
        { href: "/admin/dashboard/settings", label: "اطلاعات کافه" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-ink/10">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ms-2 rounded-md text-ink/80 hover:bg-ink/5 transition-colors"
              aria-label="باز کردن منو"
            >
              <MenuIcon />
            </button>
            <span className="font-display font-semibold text-ink">پنل مدیریت</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu restaurantName={restaurant?.name ?? null} />
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <nav className="absolute top-0 start-0 h-full w-72 max-w-[80vw] bg-card border-e border-ink/10 shadow-lift p-5">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-semibold text-ink">منوی دیجیتال</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-md text-ink/60 hover:bg-ink/5 transition-colors"
                aria-label="بستن منو"
              >
                <CloseIcon />
              </button>
            </div>

            {restaurant && (
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-ink/10">
                {restaurant.logoUrl ? (
                  <img src={restaurant.logoUrl} alt={restaurant.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-display font-semibold">
                    {restaurant.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-ink font-medium truncate">{restaurant.name}</p>
                  <Link
                    href={`/menu/${restaurant.slug}`}
                    target="_blank"
                    className="text-xs text-gold hover:underline"
                  >
                    مشاهده‌ی منوی عمومی
                  </Link>
                </div>
              </div>
            )}

            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2.5 rounded-md text-sm transition-colors ${
                      pathname === item.href
                        ? "bg-ink text-paper font-medium"
                        : "text-ink/80 hover:bg-ink/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {navItems.length === 0 && (
                <li className="text-sm text-muted px-3 py-2.5">
                  بعد از ساخت رستوران، بخش‌های مدیریت اینجا فعال می‌شن.
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}

      {children}
    </div>
  );
}
