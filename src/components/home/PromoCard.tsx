"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import { useEffect, useState } from "react";
import type { PromoModel } from "@/data/models";
import { cn } from "@/lib/utils";

/** Mirrors `promo_card.dart`: full-bleed image, dark left gradient, white pill CTA. */
export function PromoCard({ promo, priority }: { promo: PromoModel; priority?: boolean }) {
  return (
    <div className="relative h-full w-full shrink-0 snap-center overflow-hidden bg-black">
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, 600px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10 rtl:bg-gradient-to-l" />
      <div className="absolute inset-y-0 start-5 end-20 flex flex-col justify-center md:start-10 md:end-1/3">
        <h3 className="text-[22px] font-black leading-tight tracking-tight text-white md:text-4xl lg:text-[44px]">
          {promo.title}
        </h3>
        <p className="mt-1 text-xs font-medium text-white/75 md:mt-3 md:text-base">{promo.sub}</p>
        <button
          type="button"
          className="mt-3.5 w-fit rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-black md:mt-6 md:px-6 md:py-2.5 md:text-sm"
        >
          {promo.cta}
        </button>
      </div>
    </div>
  );
}

/** 160px tall carousel, auto advances every 4s, dots at the bottom. */
export function PromoCarousel({ promos }: { promos: PromoModel[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % promos.length), 4000);
    return () => clearInterval(t);
  }, [promos.length]);

  return (
    <div className="relative h-40 overflow-hidden rounded-[20px] md:h-80 md:rounded-3xl lg:h-[440px]">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out rtl:flex-row-reverse"
        style={{ transform: `translateX(-${index * 100}%)` }}
        dir="ltr"
      >
        {promos.map((p, i) => (
          <PromoCard key={p.title} promo={p} priority={i === 0} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {promos.map((p, i) => (
          <button
            key={p.title}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-[5px] rounded-full transition-all duration-250",
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/45",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Mirrors `promo_mini_card.dart`. `wide` lets it fill a grid cell / sidebar on desktop. */
export function PromoMiniCard({ promo, wide }: { promo: PromoModel; wide?: boolean }) {
  return (
    <div
      className={cn(
        "relative h-[94px] shrink-0 overflow-hidden rounded-card",
        wide ? "w-[146px] md:h-44 md:w-full md:rounded-2xl" : "w-[146px]",
      )}
    >
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        sizes="(max-width: 768px) 146px, 300px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/55" />
      <div className="absolute inset-x-2.5 bottom-2 md:inset-x-4 md:bottom-3">
        <p className="truncate text-xs font-extrabold leading-tight text-white md:text-sm">
          {promo.title}
        </p>
        <p className="truncate text-[9px] text-white/85 md:text-xs">{promo.sub}</p>
      </div>
    </div>
  );
}
