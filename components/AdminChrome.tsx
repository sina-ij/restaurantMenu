"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { List, X, UserCircle } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundPattern } from "@/components/BackgroundPattern";

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
        <UserCircle className="h-5 w-5" weight="duotone" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-11 z-30 w-48 bg-card border border-ink/10 rounded-2xl shadow-lift py-2">
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
        { href: "/admin/dashboard/stats", label: "آمار بازدید" },
        { href: "/admin/dashboard/settings", label: "اطلاعات کافه" },
      ]
    : [];

  return (
    <div className="relative min-h-screen bg-paper">
      <BackgroundPattern opacity={0.35} />
      <header className="relative sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-ink/10">
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ms-2 rounded-xl text-ink/80 hover:bg-ink/5 transition-colors"
              aria-label="باز کردن منو"
            >
              <List className="h-5 w-5" weight="bold" />
            </button>
            {restaurant ? (
              <div className="flex items-center gap-2">
                {restaurant.logoUrl ? (
                  <img
                    src={restaurant.logoUrl}
                    alt={restaurant.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex w-7 h-7 rounded-full bg-gold/10 items-center justify-center text-gold text-xs font-display font-semibold">
                    {restaurant.name.charAt(0)}
                  </span>
                )}
                <span className="font-display font-semibold text-ink truncate max-w-[10rem]">
                  {restaurant.name}
                </span>
              </div>
            ) : (
              <span className="font-display font-semibold text-ink">پنل مدیریت</span>
            )}
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
          <nav className="absolute top-0 start-0 h-full w-72 max-w-[80vw] bg-card border-e border-ink/10 shadow-lift p-5 rounded-e-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-semibold text-ink">منوی دیجیتال</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-xl text-ink/60 hover:bg-ink/5 transition-colors"
                aria-label="بستن منو"
              >
                <X className="h-5 w-5" weight="bold" />
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
                    className={`block px-3 py-2.5 rounded-xl text-sm transition-colors ${
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
