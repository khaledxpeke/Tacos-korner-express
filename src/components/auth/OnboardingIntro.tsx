"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { onboardingSlides } from "@/data/misc";
import { cn } from "@/lib/utils";
import { BrandBackdrop, GlassChip, SLIDE_MS, StoryBars, slideChips } from "./BrandSlides";

export const ONBOARDING_KEY = "tk_onboarding_seen";

/**
 * First launch on phones: the brand slides full screen, with Skip and Continue.
 * Plays like stories up to the last slide, then waits for "Get started".
 * Desktop already shows them in the side panel, so this is phone-only.
 */
export function OnboardingIntro({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const last = i === onboardingSlides.length - 1;
  const slide = onboardingSlides[i];
  const chip = slideChips[i % slideChips.length];

  useEffect(() => {
    if (last) return;
    const id = window.setTimeout(() => setI((n) => n + 1), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [i, last]);

  const go = (n: number) => setI(Math.max(0, Math.min(onboardingSlides.length - 1, n)));
  const next = () => (last ? onDone() : go(i + 1));

  return (
    <div
      className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-linear-to-br from-primary via-primary-dark to-[#6e0a0f] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white md:hidden"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) < 40) return;
        // Swipe left for the next slide; RTL flips it.
        const rtl = document.documentElement.dir === "rtl";
        go(i + ((dx < 0) !== rtl ? 1 : -1));
      }}
    >
      <BrandBackdrop />

      <div className="relative z-10 flex items-center justify-between">
        <span className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-lg shadow-black/10">
            <Image src="/images/logo/logo_foreground.png" alt="" width={32} height={32} />
          </span>
          <span className="text-lg font-bold">Takos Korner</span>
        </span>
        <button
          type="button"
          onClick={onDone}
          className={cn(
            "rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold backdrop-blur transition hover:bg-white/20",
            last && "invisible",
          )}
        >
          Skip
        </button>
      </div>

      <StoryBars index={i} onSelect={go} playing={!last} className="relative z-10 mt-5" />

      <div className="relative z-10 flex flex-1 flex-col justify-center py-8">
        {/* Photo stack */}
        <div className="relative mx-2">
          <span aria-hidden className="absolute inset-0 translate-x-2 translate-y-2.5 rotate-3 rounded-[26px] bg-white/10" />
          <span aria-hidden className="absolute inset-0 -translate-x-1.5 translate-y-1 -rotate-2 rounded-[26px] bg-black/15" />
          <div className="relative aspect-[6/5] max-h-[40dvh] w-full overflow-hidden rounded-[26px] shadow-2xl shadow-black/30 ring-1 ring-white/20">
            {onboardingSlides.map((s, k) => (
              <Image
                key={s.title}
                src={s.image}
                alt=""
                fill
                loading={k === 0 ? "eager" : undefined}
                sizes="100vw"
                className={cn(
                  "object-cover transition duration-700",
                  k === i ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
            <span className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <GlassChip key={`t${i}`} {...chip.top} className="-start-4 top-4 max-w-[70%]" />
          <GlassChip
            key={`b${i}`}
            {...chip.bottom}
            className="-bottom-6 -end-4 min-w-40 max-w-[75%] [animation-delay:120ms]"
          />
        </div>

        <div className="mt-12">
          <h1 key={slide.title} className="brand-rise text-[1.9rem] font-extrabold leading-tight">
            {slide.title}
          </h1>
          <p key={slide.sub} className="brand-rise mt-2.5 text-sm leading-relaxed text-white/80 [animation-delay:80ms]">
            {slide.sub}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        {i > 0 && (
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(i - 1)}
            className="grid h-13 w-13 shrink-0 place-items-center rounded-[14px] border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <Icon name="alt-arrow-left-outline" size={20} className="rtl:rotate-180" />
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-[14px] bg-white text-sm font-extrabold text-primary shadow-xl shadow-black/15 transition active:scale-[0.98]"
        >
          {last ? "Get started" : "Continue"}
          <Icon name={last ? "check-circle-bold" : "alt-arrow-right-outline"} size={18} className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
