"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { RestaurantModel } from "@/data/models";
import { cn } from "@/lib/utils";

/**
 * Static placeholder for `restaurants_map_view.dart`.
 * Pins are positioned from lat/lng inside the bounding box of the given restaurants.
 */
export function RestaurantsMap({
  restaurants,
  onSelect,
}: {
  restaurants: RestaurantModel[];
  onSelect: (r: RestaurantModel) => void;
}) {
  const [active, setActive] = useState<RestaurantModel | null>(restaurants[0] ?? null);

  const lats = restaurants.map((r) => r.lat);
  const lngs = restaurants.map((r) => r.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const pos = (r: RestaurantModel) => ({
    left: `${8 + ((r.lng - minLng) / (maxLng - minLng || 1)) * 84}%`,
    top: `${10 + (1 - (r.lat - minLat) / (maxLat - minLat || 1)) * 74}%`,
  });

  return (
    <div className="overflow-hidden rounded-card border-[0.5px] border-border bg-card shadow-card">
      <div
        className="relative h-[300px] w-full bg-card-blue"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="absolute inset-x-0 top-1/3 h-3 -rotate-6 bg-blue/15" />
        <div className="absolute inset-y-0 start-1/4 w-2 rotate-12 bg-blue/10" />
        {restaurants.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-label={r.name}
            style={pos(r)}
            onClick={() => setActive(r)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-full transition-transform",
              active?.id === r.id ? "z-10 scale-125 text-primary" : "text-primary-dark/80",
            )}
          >
            <Icon name="map-point-bold" size={28} className="drop-shadow" />
          </button>
        ))}
        <span className="absolute bottom-2 end-2 rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-semibold text-text-muted">
          Map preview
        </span>
      </div>
      {active && (
        <button
          type="button"
          onClick={() => onSelect(active)}
          className="flex w-full items-center gap-3 border-t border-border p-3 text-start"
        >
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px]">
            <Image src={active.image} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-text">{active.name}</span>
            <span className="block truncate text-[11px] text-text-muted">{active.address}</span>
            <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-text">
              <Icon name="star-bold" size={11} className="text-amber" />
              {active.rating} · {active.deliveryTime}
            </span>
          </span>
          <Icon name="alt-arrow-right-outline" size={18} className="text-text-muted rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}
