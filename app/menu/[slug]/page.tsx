import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { MenuItemCard } from "@/components/MenuItemCard";
import { hexToRgbTriplet } from "@/lib/color";

export const revalidate = 0;

async function trackView(restaurantId: string) {
  try {
    const now = new Date();
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        viewCount: { increment: 1 },
        dailyStats: {
          upsert: {
            where: { restaurantId_day: { restaurantId, day } },
            create: { day, count: 1 },
            update: { count: { increment: 1 } },
          },
        },
      },
    });
  } catch (err) {
    console.error("track view error:", err);
  }
}

export default async function PublicMenuPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
    include: {
      categories: {
        orderBy: { order: "asc" },
        include: {
          items: {
            where: { available: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!restaurant) return notFound();

  await trackView(restaurant.id);

  const categoriesWithItems = restaurant.categories.filter(
    (c) => c.items.length > 0
  );

  return (
    <main
      className="relative min-h-screen bg-paper"
      style={{ "--color-gold": hexToRgbTriplet(restaurant.accentColor) } as React.CSSProperties}
    >
      <BackgroundPattern opacity={0.5} />
      <div className="fixed top-4 left-4 z-20">
        <ThemeToggle />
      </div>
      <header className="relative border-b border-ink/10 px-6 pt-12 pb-8 text-center">
        {restaurant.logoUrl ? (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-white shadow-soft"
          />
        ) : (
          <div className="flex items-center justify-center gap-2 text-gold mb-4" aria-hidden="true">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>
        )}
        {restaurant.businessType && (
          <span className="inline-block text-xs px-3 py-1 rounded-full border border-gold/40 text-gold mb-2">
            {restaurant.businessType}
          </span>
        )}
        <h1 className="font-display font-semibold text-3xl text-ink">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-muted mt-2 text-sm max-w-md mx-auto leading-relaxed">
            {restaurant.description}
          </p>
        )}
        <Link
          href={`/menu/${restaurant.slug}/about`}
          className="inline-flex items-center gap-1.5 mt-4 text-xs px-3.5 py-1.5 rounded-full border border-gold/40 text-ink/80 hover:bg-gold/10 transition-colors"
        >
          درباره ما
        </Link>
      </header>

      {categoriesWithItems.length === 0 ? (
        <p className="relative text-center text-muted py-20">
          منو هنوز آماده نشده، به‌زودی برمی‌گردیم.
        </p>
      ) : (
        <>
          <nav className="sticky top-0 bg-paper/95 backdrop-blur border-b border-ink/10 overflow-x-auto whitespace-nowrap px-4 py-3 flex gap-2 z-10">
            {categoriesWithItems.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="text-sm px-4 py-1.5 rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-paper transition-colors font-medium"
              >
                {cat.name}
              </a>
            ))}
          </nav>

          <div className="relative max-w-xl mx-auto px-4 py-10 space-y-14">
            {categoriesWithItems.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                    />
                  )}
                  <h2 className="font-display font-semibold text-2xl text-ink whitespace-nowrap">
                    {cat.name}
                  </h2>
                  <span className="h-px flex-1 bg-gradient-to-l from-gold/40 to-transparent" />
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold/50 flex-shrink-0" aria-hidden="true" />
                </div>
                <div className="space-y-5">
                  {cat.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {restaurant.phone && (
        <footer className="relative text-center text-muted text-sm py-8 border-t border-ink/10">
          تماس: <span dir="ltr">{restaurant.phone}</span>
        </footer>
      )}
    </main>
  );
}
