import Link from "next/link";
import { QrCode, Lightning, Sparkle, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Reveal } from "@/components/Reveal";

const features = [
  { title: "QR اختصاصی", desc: "یک لینک و کد QR منحصربه‌فرد برای منوی شما", Icon: QrCode },
  { title: "بروزرسانی آنی", desc: "هر تغییری بدهید، همان لحظه به مشتری نمایش داده می‌شود", Icon: Lightning },
  { title: "طراحی زیبا", desc: "صفحه‌ای در شأن رستوران و کافه‌ی شما", Icon: Sparkle },
];

// پیش‌نمایشِ واقعیِ محصول (نه اسکرین‌شات جعلی): یک منوی کوچک با همان زبان طراحی.
function MenuPreview() {
  const items = [
    { name: "قهوه‌ی دمی", price: "۸۵٬۰۰۰" },
    { name: "لاته", price: "۱۲۰٬۰۰۰" },
    { name: "چیزکیک", price: "۱۶۵٬۰۰۰" },
  ];
  return (
    <div className="mx-auto w-[248px] rounded-[2.4rem] border border-ink/15 bg-card p-2.5 shadow-lift">
      <div className="overflow-hidden rounded-[1.9rem] bg-paper">
        <div className="bg-gradient-to-b from-gold/25 to-gold/5 px-5 pb-5 pt-6 text-center">
          <span className="mb-2 inline-block rounded-full border border-gold/40 px-2.5 py-0.5 text-[10px] text-gold">
            کافه
          </span>
          <p className="font-display text-lg font-semibold text-ink">کافه‌ی نمونه</p>
        </div>
        <div className="space-y-2.5 px-4 pb-5 pt-4">
          <p className="font-display text-sm font-semibold text-ink">نوشیدنی‌های گرم</p>
          {items.map((it) => (
            <div
              key={it.name}
              className="flex items-baseline justify-between gap-2 rounded-xl border border-ink/5 bg-card px-3 py-2.5 shadow-soft"
            >
              <span className="text-xs font-semibold text-ink">{it.name}</span>
              <span className="text-xs font-medium tabular-nums text-gold">{it.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-paper">
      <BackgroundPattern opacity={0.5} />
      <div
        className="pointer-events-none absolute -top-28 right-[-6rem] h-80 w-80 rounded-full bg-gold/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-[-6rem] h-80 w-80 rounded-full bg-wine/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="fixed top-4 left-4 z-20">
        <ThemeToggle />
      </div>

      <section className="relative mx-auto flex min-h-[100dvh] max-w-6xl items-start px-6 py-16 lg:items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* ستون محتوا */}
          <Reveal className="text-center lg:text-right">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs text-ink/80">
              منوی دیجیتال با کد QR
            </span>

            <h1 className="font-display text-[1.75rem] font-semibold leading-[1.4] text-ink sm:text-4xl md:text-5xl md:leading-[1.3]">
              منوی رستورانتان، یک اسکن با مشتری فاصله دارد
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-8 text-muted lg:mx-0">
              یک صفحه‌ی زیبا برای منوی کافه یا رستورانتان بسازید و با یک کد QR در اختیار مشتری بگذارید.
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                href="/admin/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-ink px-9 py-3.5 font-medium text-paper shadow-lift transition-all hover:bg-ink/90 active:scale-[0.98]"
              >
                ورود
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" weight="bold" />
              </Link>
            </div>

            <ul className="mt-12 grid gap-5 border-t border-ink/10 pt-8 sm:grid-cols-2 lg:grid-cols-1">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-3 text-right">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <f.Icon className="h-5 w-5" weight="duotone" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{f.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">{f.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ستون ویژوال: پیش‌نمایش منو */}
          <Reveal delay={0.12}>
            <MenuPreview />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
