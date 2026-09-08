"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
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
      className={`relative h-9 w-9 rounded-full text-ink/70 hover:bg-ink/5 transition-colors overflow-hidden ${className}`}
      aria-label={dark ? "حالت روشن" : "حالت تاریک"}
    >
      <Sun
        weight="duotone"
        className={`absolute inset-0 m-auto h-5 w-5 transition-all duration-300 ${
          mounted && dark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        weight="duotone"
        className={`absolute inset-0 m-auto h-5 w-5 transition-all duration-300 ${
          mounted && dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
      />
    </button>
  );
}
