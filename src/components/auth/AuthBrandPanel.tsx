"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { onboardingSlides } from "@/data/misc";
import { cn } from "@/lib/utils";

const floaters = [
  { icon: "chef-hat-bold", className: "left-[6%] top-[22%]", delay: "0s", duration: "7s" },
  { icon: "ladle-bold", className: "right-[8%] top-[16%]", delay: "-2s", duration: "8.5s" },
  { icon: "flame-bold", className: "right-[12%] top-[46%]", delay: "-4s", duration: "9s" },
  { icon: "donut-bold", className: "left-[10%] bottom-[28%]", delay: "-1s", duration: "6.5s" },
  { icon: "cup-paper-bold", className: "right-[6%] bottom-[22%]", delay: "-3.5s", duration: "8s" },
  { icon: "fire-bold", className: "left-[42%] top-[12%]", delay: "-5s", duration: "10s" },
];

/** Left auth panel. Cycles the onboarding slides on its own. */
export function AuthBrandPanel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setI((n) => (n + 1) % onboardingSlides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  const slide = onboardingSlides[i];

  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#7a0a10] text-white md:flex md:flex-col md:justify-between md:p-10 lg:p-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="blob-drift absolute -left-16 top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <span className="blob-drift absolute -right-10 bottom-16 h-72 w-72 rounded-full bg-black/10 blur-3xl [animation-delay:-6s]" />
        <span className="blob-drift absolute left-1/3 top-1/2 h-40 w-40 rounded-full bg-white/10 blur-2xl [animation-delay:-3s]" />
        {floaters.map((f) => (
          <span
            key={f.icon + f.className}
            className={cn("float-food absolute select-none text-white/80 drop-shadow-md", f.className)}
            style={{ animationDelay: f.delay, animationDuration: f.duration }}
          >
            <Icon name={f.icon} size={44} />
          </span>
        ))}
      </div>
      <Link href="/" className="relative z-10 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
          <Image src="/images/logo/logo_foreground.png" alt="" width={40} height={40} />
        </span>
        <span className="text-xl font-bold">Takos Korner</span>
      </Link>

      <div className="relative z-10 w-full">
        <div className="relative h-80 overflow-hidden rounded-[28px] shadow-card lg:h-96">
          {onboardingSlides.map((s, k) => (
            <Image
              key={s.title}
              src={s.image}
              alt=""
              fill
              loading={k === 0 ? "eager" : undefined}
              sizes="50vw"
              className={cn(
                "object-cover transition-opacity duration-700",
                k === i ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-12">
            {onboardingSlides.map((s, k) => (
              <button
                key={s.title}
                type="button"
                aria-label={s.title}
                aria-current={k === i ? "true" : undefined}
                onClick={() => setI(k)}
                className="grid h-8 place-items-center"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all",
                    k === i ? "w-14 bg-white" : "w-6 bg-white/70",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <h2 className="mt-6 text-4xl font-extrabold leading-tight lg:text-5xl">{slide.title}</h2>
        <p className="mt-4 text-white/80">{slide.sub}</p>
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex gap-8">
          <Stat value="120+" label="Restaurants" />
          <Stat value="15 min" label="Avg. delivery" />
          <Stat value="4.8 ★" label="Rating" />
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} Takos Korner Express</p>
      </div>
    </aside>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}
