import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const revalidate = 0;

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
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

  const categoriesWithItems = restaurant.categories.filter(
    (c) => c.items.length > 0
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 px-6 pt-12 pb-8 text-center">
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
        <h1 className="font-display font-semibold text-3xl text-ink">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-muted mt-2 text-sm max-w-md mx-auto leading-relaxed">
            {restaurant.description}
          </p>
        )}
      </header>

      {categoriesWithItems.length === 0 ? (
        <p className="text-center text-muted py-20">
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

          <div className="max-w-xl mx-auto px-4 py-10 space-y-14">
            {categoriesWithItems.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display font-semibold text-2xl text-ink whitespace-nowrap">
                    {cat.name}
                  </h2>
                  <span className="h-px flex-1 bg-gradient-to-l from-gold/40 to-transparent" />
                </div>
                <div className="space-y-5">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-start bg-card rounded-lg p-3.5 border border-ink/5 shadow-soft"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-3">
                          <h3 className="font-body font-semibold text-ink">
                            {item.name}
                          </h3>
                          <span className="font-body font-medium text-gold whitespace-nowrap tabular-nums">
                            {formatPrice(item.price)} تومان
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-muted text-sm mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {restaurant.phone && (
        <footer className="text-center text-muted text-sm py-8 border-t border-ink/10">
          تماس: <span dir="ltr">{restaurant.phone}</span>
        </footer>
      )}
    </main>
  );
}
