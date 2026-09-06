import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col justify-center px-6 py-20 max-w-2xl mx-auto text-center">
        <p className="text-muted font-body text-sm mb-4">منوی دیجیتال با QR کد</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink mb-6">
          مشتری‌هاتون یک اسکن با گوشیشون
          <br />
          تا دیدن کل منوی شما فاصله دارن
        </h1>
        <p className="text-muted text-lg leading-relaxed mb-10">
          یک صفحه‌ی زیبا برای منوی رستوران یا کافه‌تون بسازید، عکس و قیمت هر
          آیتم رو اضافه کنید، و با یک لینک یا QR کد در اختیار مشتری بذارید.
          هر تغییری که بدید همون لحظه روی صفحه‌ی مشتری هم اعمال میشه.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin/register"
            className="bg-ink text-paper px-8 py-3 rounded-sm font-body hover:bg-ink/90 transition-colors"
          >
            ساخت منوی رستوران من
          </Link>
          <Link
            href="/admin/login"
            className="border border-ink/20 text-ink px-8 py-3 rounded-sm font-body hover:bg-ink/5 transition-colors"
          >
            ورود ادمین
          </Link>
        </div>
      </section>
    </main>
  );
}
