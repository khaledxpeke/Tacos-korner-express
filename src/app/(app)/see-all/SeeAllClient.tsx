"use client";

import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { EmptyCard } from "@/components/ui/Misc";
import { useFavorites } from "@/context/FavoritesContext";
import { useFulfillment } from "@/context/FulfillmentContext";
import { products } from "@/data/home";
import { productsForMode, restaurantsForMode } from "@/lib/restaurants";

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
  const { mode } = useFulfillment();
  const availableRestaurants = restaurantsForMode(mode);
  const availableProducts = productsForMode(mode, products);

  const items =
    kind === "new"
      ? availableProducts.filter((p) => p.isNew)
      : kind === "popular"
        ? availableProducts.filter((p) => p.isFeatured)
        : kind === "favorites"
          ? availableProducts.filter((p) => favoriteProductNames.includes(p.name))
          : [];

  return (
    <>
      <BackAppBar
        title={titles[kind]}
        subtitle={
          kind === "restaurants" ? `${availableRestaurants.length} restaurants` : `${items.length} dishes`
        }
      />
      <Page>
        {kind === "restaurants" ? (
          availableRestaurants.length === 0 ? (
            <EmptyCard
              icon="shop-bold"
              title="No restaurants for delivery"
              message="Switch to pickup to see kitchens that don't deliver."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {availableRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )
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
    </>
  );
}
