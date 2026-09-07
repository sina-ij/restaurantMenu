import { getCurrentRestaurant } from "@/lib/getCurrentRestaurant";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function dayLabel(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", { weekday: "short", day: "numeric", month: "short" }).format(date);
}

export default async function StatsPage() {
  const restaurant = await getCurrentRestaurant();
  if (!restaurant) redirect("/admin/login");

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 6);
  since.setUTCHours(0, 0, 0, 0);

  const stats = await prisma.dailyStat.findMany({
    where: { restaurantId: restaurant.id, day: { gte: since } },
    orderBy: { day: "asc" },
  });

  const days: { date: Date; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    d.setUTCHours(0, 0, 0, 0);
    const match = stats.find((s) => s.day.getTime() === d.getTime());
    days.push({ date: d, count: match?.count ?? 0 });
  }

  const todayCount = days[days.length - 1].count;
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <main className="relative px-4 py-8 md:px-10 max-w-2xl mx-auto">
      <h1 className="font-display font-semibold text-2xl text-ink mb-8">آمار بازدید منو</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-ink/10 rounded-xl shadow-soft p-5 text-center">
          <p className="text-3xl font-display font-semibold text-ink tabular-nums">
            {new Intl.NumberFormat("fa-IR").format(restaurant.viewCount)}
          </p>
          <p className="text-muted text-sm mt-1">مجموع بازدید</p>
        </div>
        <div className="bg-card border border-ink/10 rounded-xl shadow-soft p-5 text-center">
          <p className="text-3xl font-display font-semibold text-ink tabular-nums">
            {new Intl.NumberFormat("fa-IR").format(todayCount)}
          </p>
          <p className="text-muted text-sm mt-1">بازدید امروز</p>
        </div>
      </div>

      <div className="bg-card border border-ink/10 rounded-xl shadow-soft p-6">
        <h2 className="font-display font-semibold text-lg text-ink mb-5">۷ روز اخیر</h2>
        <div className="space-y-3">
          {days.map((d) => (
            <div key={d.date.toISOString()} className="flex items-center gap-3">
              <span className="text-muted text-xs w-24 flex-shrink-0">{dayLabel(d.date)}</span>
              <div className="flex-1 h-2.5 bg-paper rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: `${(d.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-ink text-sm tabular-nums w-8 text-left flex-shrink-0">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-muted text-xs mt-6 text-center leading-relaxed">
        این آمار تعداد بازدید صفحه‌ی عمومی منوتونه (نه لزوماً افراد یکتا).
      </p>
    </main>
  );
}
