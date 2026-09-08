"use client";

import { useEffect, useRef, useState } from "react";

// نویگیشن چسبانِ دسته‌ها با هایلایتِ بخشِ فعال. به‌جای listenerِ scroll
// (که در هر فریم re-render می‌کند و بخش ۵.D اسکیل ممنوعش کرده) از
// IntersectionObserver استفاده می‌کنیم.
export function CategoryNav({ categories }: { categories: { id: string; name: string }[] }) {
  const [active, setActive] = useState<string | null>(categories[0]?.id ?? null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    // فعال = آخرین بخشی که سرتیترش از خطِ نزدیکِ بالای صفحه گذشته باشد.
    // موقعیت‌ها را از روی DOM می‌خوانیم؛ IntersectionObserver فقط به‌عنوان
    // محرکِ به‌روزرسانی (به‌جای listenerِ scroll، بخش ۵.D) با thresholdهای متعدد.
    const LINE = 130;
    function recompute() {
      let current = categories[0]?.id ?? null;
      for (const c of categories) {
        const el = document.getElementById(`cat-${c.id}`);
        if (el && el.getBoundingClientRect().top <= LINE) current = c.id;
      }
      setActive(current);
    }

    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const observer = new IntersectionObserver(recompute, { threshold: thresholds });
    sections.forEach((s) => observer.observe(s));
    recompute();
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    if (!active || !navRef.current) return;
    const pill = navRef.current.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    pill?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-10 flex gap-2 overflow-x-auto whitespace-nowrap border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur"
    >
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`#cat-${cat.id}`}
          data-cat={cat.id}
          onClick={() => setActive(cat.id)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            active === cat.id
              ? "border-gold bg-gold text-paper"
              : "border-ink/15 text-ink hover:border-gold/60"
          }`}
        >
          {cat.name}
        </a>
      ))}
    </nav>
  );
}
