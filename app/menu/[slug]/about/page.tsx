import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Clock, ForkKnife, NavigationArrow, ArrowRight, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Reveal } from "@/components/Reveal";
import { menuThemeStyle } from "@/lib/color";
import { instagramUrl } from "@/lib/links";

export const revalidate = 0;

export default async function AboutPage({ params }: { params: { slug: string } }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: params.slug },
  });

  if (!restaurant) return notFound();

  const hasInfo = restaurant.address || restaurant.phone || restaurant.workingHours;
  const ig = instagramUrl(restaurant.instagram);

  return (
    <main className="relative min-h-screen bg-paper">
      <style dangerouslySetInnerHTML={{ __html: menuThemeStyle(restaurant.accentColor) }} />
      <BackgroundPattern opacity={0.5} pattern={restaurant.pattern} />
      <div className="fixed top-4 left-4 z-20">
        <ThemeToggle />
      </div>
      <header className="relative overflow-hidden border-b border-ink/10 px-6 pt-14 pb-10 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/15 to-transparent"
          aria-hidden="true"
        />
        <div className="relative">
          {restaurant.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt={restaurant.name}
              className="mx-auto mb-4 h-20 w-20 rounded-full bg-white object-contain p-1.5 shadow-soft ring-1 ring-ink/10"
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
          <p className="mt-2 text-sm text-muted">درباره ما</p>
        </div>
      </header>

      <Reveal className="relative mx-auto max-w-md px-4 py-10">
        {restaurant.description && (
          <p className="mb-8 text-center leading-relaxed text-ink/90">{restaurant.description}</p>
        )}

        {(hasInfo || ig) && (
          <div className="mb-8 grid gap-3">
            {restaurant.address && (
              <div className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-card p-4 text-ink/90 shadow-soft">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <MapPin className="h-5 w-5" weight="duotone" />
                </span>
                <span className="leading-relaxed">{restaurant.address}</span>
              </div>
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-card p-4 text-ink/90 shadow-soft transition-colors hover:bg-ink/5"
              >
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Phone className="h-5 w-5" weight="duotone" />
                </span>
                <span dir="ltr" className="leading-relaxed">
                  {restaurant.phone}
                </span>
              </a>
            )}
            {restaurant.workingHours && (
              <div className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-card p-4 text-ink/90 shadow-soft">
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Clock className="h-5 w-5" weight="duotone" />
                </span>
                <span className="leading-relaxed">{restaurant.workingHours}</span>
              </div>
            )}
            {ig && (
              <a
                href={ig}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-card p-4 text-ink/90 shadow-soft transition-colors hover:bg-ink/5"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <InstagramLogo className="h-5 w-5" weight="duotone" />
                </span>
                <span dir="ltr" className="leading-relaxed">
                  {restaurant.instagram?.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@").replace(/^(?!@)/, "@")}
                </span>
              </a>
            )}
          </div>
        )}

        {restaurant.locationUrl && (
          <a
            href={restaurant.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-gold py-3 font-medium text-paper transition-colors hover:bg-gold/90"
          >
            <NavigationArrow className="h-5 w-5" weight="fill" />
            مسیریابی روی نقشه
          </a>
        )}

        <div className="text-center">
          <Link
            href={`/menu/${restaurant.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
          >
            <ArrowRight className="h-4 w-4" weight="bold" />
            بازگشت به منو
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
