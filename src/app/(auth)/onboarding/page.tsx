"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { languages, useLanguage } from "@/context/LanguageContext";
import { onboardingSlides } from "@/data/misc";
import { cn } from "@/lib/utils";

/** Mirrors `onboarding_screen.dart`: 3 slides, language picker, then login. */
export default function OnboardingPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [i, setI] = useState(0);
  const last = i === onboardingSlides.length - 1;
  const slide = onboardingSlides[i];

  function finish(to: string) {
    window.localStorage.setItem("tk_onboarded", "1");
    router.push(to);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative h-[52dvh] w-full md:h-80">
        <Image src={slide.image} alt="" fill priority sizes="600px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent md:from-card" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
          <div className="flex gap-1 rounded-full bg-black/35 p-1 backdrop-blur">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase",
                  language === l.code ? "bg-white text-text" : "text-white",
                )}
              >
                <Image src={`/images/flags/${l.code}.png`} alt="" width={14} height={14} className="rounded-full" />
                {l.code}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => finish("/login")}
            className="rounded-full bg-black/35 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-8">
        <div className="flex gap-1.5">
          {onboardingSlides.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Slide ${k + 1}`}
              onClick={() => setI(k)}
              className={cn("h-1.5 rounded-full transition-all", k === i ? "w-7 bg-primary" : "w-1.5 bg-border")}
            />
          ))}
        </div>
        <h1 className="mt-5 text-[26px] font-extrabold leading-tight text-text">{slide.title}</h1>
        <p className="mt-3 text-sm text-text-body">{slide.sub}</p>
        <span className="flex-1" />
        <div className="mt-8 flex items-center gap-3">
          {i > 0 && (
            <button
              type="button"
              aria-label="Previous"
              onClick={() => setI(i - 1)}
              className="grid h-12 w-12 place-items-center rounded-[12px] border border-border text-text"
            >
              <Icon name="alt-arrow-left-outline" size={20} className="rtl:rotate-180" />
            </button>
          )}
          <Button
            title={last ? "Get Started" : "Next"}
            icon="alt-arrow-right-outline"
            iconRight
            className="flex-1"
            onClick={() => (last ? finish("/login") : setI(i + 1))}
          />
        </div>
        <button
          type="button"
          onClick={() => finish("/home")}
          className="mt-4 text-center text-xs font-semibold text-text-muted"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}
