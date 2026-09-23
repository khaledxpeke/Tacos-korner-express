"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { EmptyCard } from "@/components/ui/Misc";
import { useFulfillment } from "@/context/FulfillmentContext";
import type { RestaurantModel } from "@/data/models";
import { cn } from "@/lib/utils";

const PickupMap = dynamic(() => import("./PickupMap").then((mod) => mod.PickupMap), {
  ssr: false,
  loading: () => <div className="h-full min-h-[280px] w-full animate-pulse bg-card-blue" />,
});

function useWideScreen() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return wide;
}

/** Pickup browse: restaurant list on the left, map on the right from tablet up. */
export function PickupBrowse({ restaurants }: { restaurants: RestaurantModel[] }) {
  const router = useRouter();
  const { address } = useFulfillment();
  const wide = useWideScreen();
  const [activeId, setActiveId] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const cards = useRef<Record<number, HTMLDivElement | null>>({});

  const openRestaurant = (restaurant: RestaurantModel) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const highlight = (restaurant: RestaurantModel) => {
    setActiveId(restaurant.id);
    const scroller = list.current;
    const card = cards.current[restaurant.id];
    if (!scroller || !card) return;

    const padding = 20;
    const offset = card.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    const cardHeight = card.offsetHeight;
    const viewHeight = scroller.clientHeight;

    if (cardHeight + padding * 2 >= viewHeight) {
      scroller.scrollTo({ top: scroller.scrollTop + offset - padding, behavior: "smooth" });
      return;
    }
    if (offset < padding) {
      scroller.scrollTo({ top: scroller.scrollTop + offset - padding, behavior: "smooth" });
    } else if (offset + cardHeight > viewHeight - padding) {
      scroller.scrollTo({
        top: scroller.scrollTop + (offset + cardHeight) - viewHeight + padding,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="md:sticky md:top-[4.25rem] md:z-0 md:grid md:h-[calc(100dvh-4.25rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] md:overflow-hidden">
      <div ref={list} className="px-5 py-5 md:h-full md:min-h-0 md:overflow-y-auto md:px-8 md:py-6">
        <p className="text-sm font-semibold text-primary">Pickup</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-text md:text-3xl">
          {address ? `Restaurants near ${address.split(",")[0]}` : "Restaurants near you"}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Every kitchen is listed, including ones that only offer pickup.
        </p>
        <div className="mt-5">
          {restaurants.length === 0 ? (
            <EmptyCard
              icon="shop-bold"
              title="No restaurants found"
              message="Try adjusting your filters or search again"
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  ref={(node) => {
                    cards.current[restaurant.id] = node;
                  }}
                  className={cn(
                    "rounded-2xl",
                    activeId === restaurant.id && "ring-2 ring-primary ring-offset-2 ring-offset-bg",
                  )}
                >
                  <RestaurantCard restaurant={restaurant} onClick={() => openRestaurant(restaurant)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {wide && (
        <div className="relative hidden h-full min-h-[420px] border-s border-border md:block">
          <PickupMap
            restaurants={restaurants}
            activeId={activeId}
            onSelect={highlight}
            onOpen={openRestaurant}
          />
        </div>
      )}
    </section>
  );
}
