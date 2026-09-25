"use client";

import { cn } from "@/lib/utils";

/** Mirrors `orders_view_toggle.dart`: segmented Active / Past control. Reused for menu tabs. */
export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
  className?: string;
}) {
  return (
    <div className={cn("flex rounded-[14px] bg-card-gray p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[11px] py-2.5 text-sm font-bold transition",
              active ? "bg-card text-primary shadow-card" : "text-text-muted",
            )}
          >
            {o.label}
            {o.count != null && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-primary text-white" : "bg-border text-text-muted",
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const OrdersViewToggle = SegmentedToggle;

/** Active / Past as two separate buttons, not a nested pill. */
export function OrderFilterTabs<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition",
              on
                ? "border-primary bg-primary text-white shadow-card"
                : "border-border bg-card text-text hover:border-text-muted",
            )}
          >
            {o.label}
            {o.count != null && (
              <span
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold",
                  on ? "bg-white text-primary" : "bg-card-gray text-text-muted",
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
