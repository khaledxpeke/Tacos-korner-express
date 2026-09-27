"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Mirrors `see_all_card.dart`: section header with icon and See all link. */
export function SeeAllCard({
  title,
  icon,
  iconClass,
  onSeeAll,
  trailing,
  className,
}: {
  title: string;
  icon?: string;
  iconClass?: string;
  onSeeAll?: () => void;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      {icon && (
        <Icon
          name={icon}
          size={16}
          className={cn("me-1.5 md:hidden", iconClass ?? "text-text")}
        />
      )}
      {icon && (
        <span
          className={cn(
            "me-2.5 hidden h-9 w-9 place-items-center rounded-[10px] bg-card shadow-card md:grid",
            iconClass ?? "text-text",
          )}
        >
          <Icon name={icon} size={18} />
        </span>
      )}
      <h2 className="text-sm font-bold text-text md:text-2xl md:font-extrabold">{title}</h2>
      <span className="flex-1" />
      <div className="flex items-center gap-2">
        {trailing}
        {onSeeAll && <SeeAllButton onClick={onSeeAll} />}
      </div>
    </div>
  );
}

/** White pill so it stands out from the grey page background. */
export function SeeAllButton({ onClick, label = "See all" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-semibold text-primary transition md:h-9 md:rounded-full md:border md:border-border md:bg-card md:px-3.5 md:text-sm md:text-text md:shadow-sm md:hover:border-primary/40 md:hover:text-primary"
    >
      {label}
      <Icon name="alt-arrow-right-outline" size={14} className="rtl:rotate-180" />
    </button>
  );
}

export type RestaurantsView = "cards" | "map";

/** Mirrors `restaurants_view_toggle.dart`. */
export function RestaurantsViewToggle({
  value,
  onChange,
}: {
  value: RestaurantsView;
  onChange: (v: RestaurantsView) => void;
}) {
  return (
    <div className="flex rounded-[10px] border border-border bg-card p-[3px] shadow-sm">
      {(
        [
          { v: "cards", icon: "widget-4-outline", label: "Cards" },
          { v: "map", icon: "map-outline", label: "Map" },
        ] as const
      ).map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors",
            value === o.v ? "bg-primary text-white" : "text-text-muted hover:text-text",
          )}
        >
          <Icon name={o.icon} size={15} />
          {o.label}
        </button>
      ))}
    </div>
  );
}
