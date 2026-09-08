import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Info, Phone, ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CategoryNav } from "@/components/CategoryNav";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
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
      <header className="relative overflow-hidden border-b border-ink/10 px-6 pt-14 pb-10 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/15 to-transparent"
          aria-hidden="true"
        />
        <Reveal className="relative" y={12}>
          {restaurant.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-white object-cover shadow-soft"
            />
          ) : (
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold shadow-soft">
              <ForkKnife className="h-7 w-7" weight="duotone" />
            </span>
          )}
          {restaurant.businessType && (
            <span className="mb-2 inline-block rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
              {restaurant.businessType}
            </span>
          )}
          <h1 className="font-display text-3xl font-semibold text-ink">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              {restaurant.description}
            </p>
          )}
          <Link
            href={`/menu/${restaurant.slug}/about`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3.5 py-1.5 text-xs text-ink/80 transition-colors hover:bg-gold/10"
          >
            <Info className="h-4 w-4" weight="duotone" />
            درباره ما
          </Link>
        </Reveal>
      </header>

      {categoriesWithItems.length === 0 ? (
        <div className="relative flex flex-col items-center gap-4 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
            <ForkKnife className="h-7 w-7" weight="duotone" />
          </span>
          <p className="text-muted">منو هنوز آماده نشده، به‌زودی برمی‌گردیم.</p>
        </div>
      ) : (
        <>
          <CategoryNav
            categories={categoriesWithItems.map((c) => ({ id: c.id, name: c.name }))}
          />

          <div className="relative mx-auto max-w-xl space-y-14 px-4 py-10">
            {categoriesWithItems.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20">
                <Reveal className="mb-6 flex items-center gap-3" y={12}>
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-10 w-10 flex-shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <h2 className="whitespace-nowrap font-display text-2xl font-semibold text-ink">
                    {cat.name}
                  </h2>
                  <span className="h-px flex-1 bg-gradient-to-l from-gold/40 to-transparent" />
                </Reveal>
                <RevealStagger className="space-y-5">
                  {cat.items.map((item) => (
                    <RevealItem key={item.id}>
                      <MenuItemCard item={item} />
                    </RevealItem>
                  ))}
                </RevealStagger>
              </section>
            ))}
          </div>
        </>
      )}

      {restaurant.phone && (
        <footer className="relative flex items-center justify-center gap-2 border-t border-ink/10 py-8 text-center text-sm text-muted">
          <Phone className="h-4 w-4 text-gold" weight="duotone" />
          تماس: <span dir="ltr">{restaurant.phone}</span>
        </footer>
      )}
    </main>
  );
}
