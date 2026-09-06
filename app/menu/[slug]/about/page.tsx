import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3a1 1 0 0 1-.3 1L7.5 10a12 12 0 0 0 6 6l1.2-1.3a1 1 0 0 1 1-.3l3 .8c.5.1.8.5.8 1V19c0 .6-.4 1-1 1h-1C9.5 20 4 14.5 4 7.5V5Z"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
      />
      <circle cx="12" cy="9.5" r="2.3" strokeWidth={1.5} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 flex-shrink-0">
      <circle cx="12" cy="12" r="8.5" strokeWidth={1.5} />
      <path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 2" />
    </svg>
  );
}

export default async function AboutPage({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
  });

  if (!restaurant) return notFound();

  const hasInfo = restaurant.address || restaurant.phone || restaurant.workingHours;

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
        <p className="text-muted mt-2 text-sm">درباره ما</p>
      </header>

      <div className="max-w-md mx-auto px-4 py-10">
        {restaurant.description && (
          <p className="text-ink/90 leading-relaxed mb-8 text-center">{restaurant.description}</p>
        )}

        {hasInfo && (
          <div className="bg-card border border-ink/10 rounded-xl shadow-soft divide-y divide-ink/10 mb-8">
            {restaurant.address && (
              <div className="flex items-start gap-3 p-4 text-ink/90">
                <span className="text-gold mt-0.5">
                  <MapPinIcon />
                </span>
                <span className="leading-relaxed">{restaurant.address}</span>
              </div>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-start gap-3 p-4 text-ink/90 hover:bg-ink/5 transition-colors"
              >
                <span className="text-gold mt-0.5">
                  <PhoneIcon />
                </span>
                <span dir="ltr" className="leading-relaxed">
                  {restaurant.phone}
                </span>
              </a>
            )}
            {restaurant.workingHours && (
              <div className="flex items-start gap-3 p-4 text-ink/90">
                <span className="text-gold mt-0.5">
                  <ClockIcon />
                </span>
                <span className="leading-relaxed">{restaurant.workingHours}</span>
              </div>
            )}
          </div>
        )}

        {restaurant.locationUrl && (
          <a
            href={restaurant.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-ink text-paper py-3 rounded-md font-medium hover:bg-ink/90 transition-colors mb-8"
          >
            مسیریابی روی نقشه
          </a>
        )}

        <div className="text-center">
          <Link href={`/menu/${restaurant.slug}`} className="text-sm text-gold hover:underline">
            ‹ بازگشت به منو
          </Link>
        </div>
      </div>
    </main>
  );
}
