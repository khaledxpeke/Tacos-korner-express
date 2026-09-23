"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { RestaurantQuickPeek } from "@/components/home/RestaurantQuickPeek";
import { EmptyCard } from "@/components/ui/Misc";
import { useFavorites } from "@/context/FavoritesContext";
import { products, restaurants } from "@/data/home";
import type { RestaurantModel } from "@/data/models";

export type SeeAllKind = "new" | "popular" | "favorites" | "restaurants";

const titles: Record<SeeAllKind, string> = {
  new: "New Arrivals",
  popular: "Popular Near You",
  favorites: "Favorites",
  restaurants: "All Restaurants",
};

/** Mirrors `see_all_screen.dart`: 2-column grid, reused for New, Popular, Favorites. */
export function SeeAllClient({ kind }: { kind: SeeAllKind }) {
  const { favoriteProductNames } = useFavorites();
  const [peek, setPeek] = useState<RestaurantModel | null>(null);

  const items =
    kind === "new"
      ? products.filter((p) => p.isNew)
      : kind === "popular"
        ? products.filter((p) => p.isFeatured)
        : kind === "favorites"
          ? products.filter((p) => favoriteProductNames.includes(p.name))
          : [];

  return (
    <>
      <BackAppBar
        title={titles[kind]}
        subtitle={
          kind === "restaurants" ? `${restaurants.length} restaurants` : `${items.length} dishes`
        }
      />
      <Page>
        {kind === "restaurants" ? (
          <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} onClick={() => setPeek(r)} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyCard
            icon={kind === "favorites" ? "heart-outline" : "bottle-bold"}
            title={kind === "favorites" ? "No favorites yet" : "No dishes found"}
            message={
              kind === "favorites"
                ? "Tap the heart on a dish to save it here"
                : "Try adjusting your filters or search again"
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} grid />
            ))}
          </div>
        )}
      </Page>
      <RestaurantQuickPeek restaurant={peek} onClose={() => setPeek(null)} />
    </>
  );
}
