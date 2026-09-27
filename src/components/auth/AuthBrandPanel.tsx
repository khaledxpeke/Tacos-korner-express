"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { onboardingSlides } from "@/data/misc";
import { cn } from "@/lib/utils";
import { BrandBackdrop, GlassChip, SLIDE_MS, StoryBars, slideChips } from "./BrandSlides";

/** Left auth panel (tablet and up). Cycles the onboarding slides with story-style progress. */
export function AuthBrandPanel() {
  const [i, setI] = useState(0);

  // Restarts whenever the slide changes, so a click on a bar gets a full slide too.
  useEffect(() => {
    const id = window.setTimeout(() => setI((n) => (n + 1) % onboardingSlides.length), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [i]);

  const slide = onboardingSlides[i];
  const chip = slideChips[i % slideChips.length];

  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary-dark to-[#6e0a0f] text-white md:flex md:flex-col md:p-10 lg:p-14">
      <BrandBackdrop />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-lg shadow-black/10">
            <Image src="/images/logo/logo_foreground.png" alt="" width={36} height={36} />
          </span>
          <span className="text-lg font-bold lg:text-xl">Takos Korner</span>
        </Link>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur lg:inline-flex">
          <Icon name="map-point-bold" size={13} />
          Delivery &amp; pickup · Tunis
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
        {/* Photo stack */}
        <div className="relative mx-auto w-full max-w-[640px]">
          <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-3 rounded-[28px] bg-white/10" />
          <span aria-hidden className="absolute inset-0 -translate-x-2 translate-y-1.5 -rotate-2 rounded-[28px] bg-black/15" />
          <div className="relative aspect-[16/10] max-h-[40dvh] w-full overflow-hidden rounded-[28px] shadow-2xl shadow-black/30 ring-1 ring-white/20">
            {onboardingSlides.map((s, k) => (
              <Image
                key={s.title}
                src={s.image}
                alt=""
                fill
                loading={k === 0 ? "eager" : undefined}
                sizes="(max-width: 1024px) 45vw, 640px"
                className={cn(
                  "object-cover transition duration-700",
                  k === i ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
            <span className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <GlassChip key={`t${i}`} {...chip.top} className="-start-4 top-6 min-w-44 lg:-start-8" />
          <GlassChip
            key={`b${i}`}
            {...chip.bottom}
            className="-end-3 bottom-6 min-w-44 [animation-delay:120ms] lg:-end-6"
          />
        </div>

        {/* Copy */}
        <div className="mx-auto mt-10 w-full max-w-[640px]">
          <StoryBars index={i} onSelect={setI} />
          <h2 key={slide.title} className="brand-rise mt-5 text-3xl font-extrabold leading-tight lg:text-[2.75rem]">
            {slide.title}
          </h2>
          <p key={slide.sub} className="brand-rise mt-3 max-w-md text-sm text-white/80 [animation-delay:80ms] lg:text-base">
            {slide.sub}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/10 py-3.5 backdrop-blur rtl:divide-x-reverse">
          <Stat icon="shop-2-bold" value="120+" label="Restaurants" />
          <Stat icon="clock-circle-bold" value="15 min" label="Avg. delivery" />
          <Stat icon="star-bold" value="4.8" label="Rating" />
        </div>
        <p className="mt-5 text-xs text-white/55">© {new Date().getFullYear()} Takos Korner Express</p>
      </div>
    </aside>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 text-center">
      <span className="flex items-center gap-1.5 text-lg font-extrabold lg:text-xl">
        <Icon name={icon} size={16} className="text-white/70" />
        {value}
      </span>
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
  );
}
