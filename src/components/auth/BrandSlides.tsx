"use client";

import { Icon } from "@/components/ui/Icon";
import { onboardingSlides } from "@/data/misc";
import { cn } from "@/lib/utils";

/** Pieces shared by the desktop auth panel and the phone intro, so both tell the same story. */

export const SLIDE_MS = 5000;

export interface SlideChip {
  icon: string;
  title: string;
  sub: string;
  progress?: number;
}

/** Two glass chips over each photo, so every slide shows what it promises. */
export const slideChips: { top: SlideChip; bottom: SlideChip }[] = [
  {
    top: { icon: "shop-2-bold", title: "120+ kitchens", sub: "Open near you now" },
    bottom: { icon: "star-bold", title: "4.8 average", sub: "From 12k reviews" },
  },
  {
    top: { icon: "magic-stick-3-bold", title: "Extra cheese", sub: "+ $1.50 · added" },
    bottom: { icon: "bookmark-bold", title: "Combo saved", sub: "Reorder in one tap" },
  },
  {
    top: { icon: "check-circle-bold", title: "Order accepted", sub: "Kitchen is on it" },
    bottom: { icon: "scooter-bold", title: "Courier on the way", sub: "Arriving in 12 min", progress: 0.7 },
  },
  {
    top: { icon: "clock-circle-bold", title: "Ready in 10 min", sub: "No waiting in line" },
    bottom: { icon: "shop-2-bold", title: "Pickup at the counter", sub: "Show your order number" },
  },
  {
    top: { icon: "star-bold", title: "+120 points", sub: "Earned on this order" },
    bottom: { icon: "crown-bold", title: "Free meal unlocked", sub: "1,500 pts reached", progress: 1 },
  },
];

/** Soft glow and a faint dot grid behind the red panel. */
export function BrandBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <span className="blob-drift absolute -left-24 -top-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <span className="blob-drift absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-black/20 blur-3xl [animation-delay:-6s]" />
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />
    </div>
  );
}

/** Story-style bars: past slides full, the current one fills over `SLIDE_MS` (or sits full when not playing). */
export function StoryBars({
  index,
  onSelect,
  playing = true,
  className,
}: {
  index: number;
  onSelect: (i: number) => void;
  playing?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-xs font-bold tabular-nums text-white/70">
        {String(index + 1).padStart(2, "0")} / {String(onboardingSlides.length).padStart(2, "0")}
      </span>
      <div className="flex flex-1 gap-1.5">
        {onboardingSlides.map((s, k) => (
          <button
            key={s.title}
            type="button"
            aria-label={s.title}
            aria-current={k === index ? "true" : undefined}
            onClick={() => onSelect(k)}
            className="group flex h-5 flex-1 items-center"
          >
            <span className="block h-1 w-full overflow-hidden rounded-full bg-white/25 transition group-hover:bg-white/40">
              {(k < index || (k === index && !playing)) && <span className="block h-full w-full bg-white" />}
              {k === index && playing && (
                <span
                  key={index}
                  className="brand-progress block h-full w-full origin-left bg-white rtl:origin-right"
                  style={{ animationDuration: `${SLIDE_MS}ms` }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function GlassChip({ icon, title, sub, progress, className }: SlideChip & { className?: string }) {
  return (
    <div
      className={cn(
        "brand-rise absolute z-10 flex items-center gap-2.5 rounded-2xl bg-white/95 p-2.5 pe-4 text-text shadow-xl shadow-black/20 backdrop-blur",
        className,
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight">{title}</span>
        <span className="block text-[11px] text-text-muted">{sub}</span>
        {progress != null && (
          <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-border">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
          </span>
        )}
      </span>
    </div>
  );
}
