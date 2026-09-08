"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { InstagramLogo, Phone, ForkKnife, ArrowLeft } from "@phosphor-icons/react";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { instagramUrl } from "@/lib/links";

// صفحه‌ی خوش‌آمدِ ورودی که قبل از منو نمایش داده می‌شود؛ با «مشاهده‌ی منو»
// بسته می‌شود. برای اینکه در همان نشست دوباره روی سر کاربر نیفتد، در
// sessionStorage علامت می‌خورد.
export function WelcomeSplash({
  slug,
  name,
  logoUrl,
  businessType,
  description,
  instagram,
  phone,
  pattern,
}: {
  slug: string;
  name: string;
  logoUrl: string | null;
  businessType: string | null;
  description: string | null;
  instagram: string | null;
  phone: string | null;
  pattern: string | null;
}) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("welcome:" + slug) === "1";
    } catch {}
    if (!seen) setShow(true);
  }, [slug]);

  function dismiss() {
    try {
      sessionStorage.setItem("welcome:" + slug, "1");
    } catch {}
    setShow(false);
  }

  const ig = instagramUrl(instagram);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-paper px-6 text-center"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <BackgroundPattern opacity={0.55} pattern={pattern} />
          <div
            className="pointer-events-none absolute -top-24 right-[-5rem] h-72 w-72 rounded-full bg-gold/20 blur-3xl"
            aria-hidden="true"
          />

          <motion.div
            className="relative flex flex-col items-center"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="mb-5 h-24 w-24 rounded-full border-2 border-white object-cover shadow-lift"
              />
            ) : (
              <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 text-gold shadow-soft">
                <ForkKnife className="h-9 w-9" weight="duotone" />
              </span>
            )}

            {businessType && (
              <span className="mb-2 inline-block rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
                {businessType}
              </span>
            )}
            <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">{name}</h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {description || "به منوی ما خوش آمدید"}
            </p>

            <button
              onClick={dismiss}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-9 py-3.5 font-medium text-paper shadow-lift transition-all hover:bg-ink/90 active:scale-[0.98]"
            >
              مشاهده‌ی منو
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" weight="bold" />
            </button>

            {(ig || phone) && (
              <div className="mt-5 flex items-center gap-3">
                {ig && (
                  <a
                    href={ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition-colors hover:border-gold/60"
                  >
                    <InstagramLogo className="h-4 w-4 text-gold" weight="duotone" />
                    اینستاگرام
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition-colors hover:border-gold/60"
                  >
                    <Phone className="h-4 w-4 text-gold" weight="duotone" />
                    تماس
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
