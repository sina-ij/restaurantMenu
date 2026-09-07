import Link from "next/link";

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 text-gold" aria-hidden="true">
      <span className="h-px w-8 bg-gold/40" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-8 bg-gold/40" />
    </div>
  );
}

const features = [
  {
    title: "QR اختصاصی",
    desc: "یک لینک و QR کد منحصربه‌فرد برای منوی شما",
    icon: (
      <path
        strokeWidth={1.5}
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h3m-3 3h6v-6h-3"
      />
    ),
  },
  {
    title: "بروزرسانی آنی",
    desc: "هر تغییری بدید، همون لحظه برای مشتری نمایش داده میشه",
    icon: <path strokeWidth={1.5} d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 4v4h-4M6 20v-4h4" />,
  },
  {
    title: "طراحی زیبا",
    desc: "صفحه‌ی منویی که در شأن رستوران و کافه‌تونه",
    icon: <path strokeWidth={1.5} d="M12 3 4 7v6c0 4.5 3.4 7.5 8 8 4.6-.5 8-3.5 8-8V7l-8-4Z" />,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper flex flex-col justify-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(34,26,19,0.04) 0, rgba(34,26,19,0.04) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(-45deg, rgba(34,26,19,0.04) 0, rgba(34,26,19,0.04) 1px, transparent 1px, transparent 18px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-wine/10 blur-3xl"
        aria-hidden="true"
      />

      <section className="relative flex flex-col items-center px-6 py-10 max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs text-ink/80 font-body mb-5">
          منوی دیجیتال با QR کد
        </span>

        <h1 className="font-display font-semibold text-3xl md:text-5xl leading-[1.5] md:leading-[1.45] text-ink mb-4">
          مشتری‌هاتون یک اسکن با گوشیشون
          <br />
          تا دیدن کل منوی شما فاصله دارن
        </h1>

        <p className="text-muted text-sm md:text-lg leading-7 md:leading-8 mb-6 max-w-xl">
          یک صفحه‌ی زیبا برای منوی رستوران یا کافه‌تون بسازید و با یک لینک یا
          QR کد در اختیار مشتری بذارید — همون لحظه که تغییرش می‌دید، برای مشتری هم اعمال میشه.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/admin/register"
            className="bg-ink text-paper px-8 py-3 rounded-md font-body font-medium shadow-lift hover:bg-ink/90 transition-colors"
          >
            ساخت منوی رستوران من
          </Link>
          <Link
            href="/admin/login"
            className="border border-ink/20 text-ink px-8 py-3 rounded-md font-body font-medium hover:bg-ink/5 transition-colors"
          >
            ورود ادمین
          </Link>
        </div>

        <Divider />

        <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-6 w-full">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-2">
              <span className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-white shadow-soft text-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 md:h-5 md:w-5">
                  {f.icon}
                </svg>
              </span>
              <h3 className="font-body font-semibold text-ink text-xs md:text-sm">{f.title}</h3>
              <p className="hidden sm:block text-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
