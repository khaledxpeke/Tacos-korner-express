"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Animated CTA for the cart and checkout. Idle: a soft shine sweeps across and the arrow nudges.
 * Pressed: the letters drop away, the arrow shoots off, the done message pops in and holds, then `onGo` runs.
 */
export function CheckoutButton({
  title = "Proceed to Checkout",
  icon = "alt-arrow-right-outline",
  doneLabel = "Let's go!",
  doneIcon = "cart-check-bold",
  holdMs = 1500,
  canGo,
  onGo,
  disabled,
  className,
}: {
  title?: string;
  icon?: string;
  doneLabel?: string;
  doneIcon?: string;
  /** How long the done message stays before `onGo` runs. */
  holdMs?: number;
  /** Return false to cancel (e.g. validation failed); no animation runs. */
  canGo?: () => boolean;
  onGo: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const [going, setGoing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function press() {
    if (going || disabled) return;
    if (canGo && !canGo()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onGo();
      return;
    }
    setGoing(true);
    // Letters take ~0.6s to fall and the message pops in at ~0.25s; then hold it.
    timer.current = setTimeout(onGo, 600 + holdMs);
  }

  const letters = Array.from(title);

  return (
    <button
      type="button"
      onClick={press}
      disabled={disabled}
      aria-label={title}
      aria-busy={going}
      className={cn(
        "relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[12px] bg-linear-to-r from-primary to-primary-dark px-6 text-sm font-bold text-white shadow-card transition-transform duration-150 disabled:opacity-50",
        !going && !disabled && "cta-shine hover:shadow-lg active:scale-[0.97]",
        going && "cursor-wait",
        className,
      )}
    >
      <span aria-hidden className="relative flex items-center whitespace-pre">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={going ? "cta-letter-fall" : "inline-block"}
            style={
              going
                ? ({
                    animationDelay: `${i * 18}ms`,
                    "--rot": `${(i % 2 ? 1 : -1) * (6 + (i % 4) * 4)}deg`,
                  } as React.CSSProperties)
                : undefined
            }
          >
            {ch}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className={cn("inline-flex rtl:rotate-180", going ? "cta-arrow-shoot" : !disabled && "cta-nudge")}
      >
        <Icon name={icon} size={18} />
      </span>
      {going && (
        <>
          <span aria-hidden className="cta-pop absolute inset-0 flex items-center justify-center gap-2">
            <Icon name={doneIcon} size={22} />
            <span className="text-sm font-bold">{doneLabel}</span>
          </span>
          <span
            aria-hidden
            className="cta-hold absolute inset-x-0 bottom-0 h-[3px] origin-left bg-white/50 rtl:origin-right"
            style={{ animationDuration: `${600 + holdMs}ms` }}
          />
        </>
      )}
    </button>
  );
}
