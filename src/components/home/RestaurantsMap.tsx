"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { RestaurantModel } from "@/data/models";

const PickupMap = dynamic(() => import("./PickupMap").then((mod) => mod.PickupMap), {
  ssr: false,
  loading: () => <div className="h-full min-h-[420px] w-full animate-pulse bg-card-blue" />,
});

/** Same live map as pickup: logo pins, popup, open the restaurant. */
export function RestaurantsMap({
  restaurants,
  onSelect,
}: {
  restaurants: RestaurantModel[];
  onSelect: (r: RestaurantModel) => void;
}) {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="h-[420px] overflow-hidden rounded-card border-[0.5px] border-border shadow-card md:h-[480px]">
      <PickupMap
        restaurants={restaurants}
        activeId={activeId}
        onSelect={(restaurant) => setActiveId(restaurant.id)}
        onOpen={onSelect}
      />
    </div>
  );
}
