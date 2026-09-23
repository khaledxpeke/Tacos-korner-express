"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { SegmentedToggle } from "@/components/orders/OrdersViewToggle";
import { Button } from "@/components/ui/Button";
import { EmptyCard } from "@/components/ui/Misc";
import { useFavorites } from "@/context/FavoritesContext";
import { useFulfillment } from "@/context/FulfillmentContext";
import { products, restaurants } from "@/data/home";
import { productsForMode, restaurantsForMode } from "@/lib/restaurants";
type View = "dishes" | "restaurants";

/** Mirrors `favorite_screen.dart`. */
export default function FavoritesPage() {
  const router = useRouter();
  const { favoriteProductNames, favoriteRestaurantIds } = useFavorites();
  const [view, setView] = useState<View>("dishes");

  const { mode } = useFulfillment();
  const dishes = productsForMode(mode, products).filter((p) => favoriteProductNames.includes(p.name));
  const rests = restaurantsForMode(mode).filter((r) => favoriteRestaurantIds.includes(r.id));
  const empty = dishes.length + rests.length === 0;

  return (
    <>
      <BackAppBar title="Favourites" fallbackHref="/profile" />
      <Page>
        {empty ? (
          <div className="mx-auto max-w-md">
            <EmptyCard
              icon="heart-outline"
              title="No favourites yet."
              message="Tap the heart on a dish or restaurant to save it here."
              action={<Button title="Browse Food" onClick={() => router.push("/home")} />}
            />
          </div>
        ) : (
          <>
            <SegmentedToggle<View>
              className="md:max-w-sm"
              value={view}
              onChange={setView}
              options={[
                { value: "dishes", label: "Dishes", count: dishes.length },
                { value: "restaurants", label: "Restaurants", count: rests.length },
              ]}
            />
            <div className="mt-4">
              {view === "dishes" ? (
                dishes.length === 0 ? (
                  <EmptyCard icon="bottle-bold" title="No favourite dishes" />
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-4">
                    {dishes.map((p) => (
                      <ProductCard key={p.id} product={p} grid />
                    ))}
                  </div>
                )
              ) : rests.length === 0 ? (
                <EmptyCard icon="shop-bold" title="No favourite restaurants" />
              ) : (
                <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                  {rests.map((r) => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Page>
    </>
  );
}
