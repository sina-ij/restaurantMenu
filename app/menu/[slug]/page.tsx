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
      <header className="border-b border-ink/10 px-6 py-8 text-center">
        {restaurant.logoUrl && (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
          />
        )}
        <h1 className="font-display text-3xl text-ink">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-muted mt-2 text-sm">{restaurant.description}</p>
        )}
      </header>

      {categoriesWithItems.length === 0 ? (
        <p className="text-center text-muted py-20">
          منو هنوز آماده نشده، به‌زودی برمی‌گردیم.
        </p>
      ) : (
        <>
          {/* نوار دسته‌بندی‌های چسبان */}
          <nav className="sticky top-0 bg-paper/95 backdrop-blur border-b border-ink/10 overflow-x-auto whitespace-nowrap px-4 py-3 flex gap-2 z-10">
            {categoriesWithItems.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="text-sm px-4 py-1.5 rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-paper transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </nav>

          <div className="max-w-xl mx-auto px-4 py-8 space-y-12">
            {categoriesWithItems.map((cat) => (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20">
                <h2 className="font-display text-2xl text-ink mb-5 pb-2 border-b-2 border-saffron/40 inline-block">
                  {cat.name}
                </h2>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-3">
                          <h3 className="font-body font-medium text-ink">
                            {item.name}
                          </h3>
                          <span className="font-body text-saffron whitespace-nowrap tabular-nums">
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
          تماس: {restaurant.phone}
        </footer>
      )}
    </main>
  );
}
