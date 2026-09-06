import Link from "next/link";

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 text-gold" aria-hidden="true">
      <span className="h-px w-10 bg-gold/40" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-10 bg-gold/40" />
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
    <main className="min-h-screen bg-paper">
      <section className="flex flex-col items-center px-6 py-20 md:py-28 max-w-2xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs text-ink/80 font-body mb-8">
          منوی دیجیتال با QR کد
        </span>

        <h1 className="font-display font-semibold text-4xl md:text-5xl leading-[1.5] md:leading-[1.45] text-ink mb-6">
          مشتری‌هاتون یک اسکن با گوشیشون
          <br />
          تا دیدن کل منوی شما فاصله دارن
        </h1>

        <p className="text-muted text-base md:text-lg leading-8 mb-10 max-w-xl">
          یک صفحه‌ی زیبا برای منوی رستوران یا کافه‌تون بسازید، عکس و قیمت هر
          آیتم رو اضافه کنید، و با یک لینک یا QR کد در اختیار مشتری بذارید.
          هر تغییری که بدید همون لحظه روی صفحه‌ی مشتری هم اعمال میشه.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-14 text-right">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft text-gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  {f.icon}
                </svg>
              </span>
              <h3 className="font-body font-semibold text-ink text-sm">{f.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
