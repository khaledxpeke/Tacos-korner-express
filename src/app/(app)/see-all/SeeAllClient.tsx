"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/home/ProductCard";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { useFavorites } from "@/context/FavoritesContext";
import { useFulfillment } from "@/context/FulfillmentContext";
import { products, recommendedProducts } from "@/data/home";
import { productsForMode, restaurantsForMode } from "@/lib/restaurants";

export type SeeAllKind = "new" | "popular" | "recommended" | "favorites" | "restaurants";

const titles: Record<SeeAllKind, string> = {
  new: "New Arrivals",
  popular: "Popular Near You",
  recommended: "Recommended dishes",
  favorites: "Favorites",
  restaurants: "All Restaurants",
};

function matches(q: string, ...fields: string[]) {
  return fields.some((f) => f.toLowerCase().includes(q));
}

/** Mirrors `see_all_screen.dart`: 2-column grid, reused for New, Popular, Favorites. Search filters in place. */
export function SeeAllClient({ kind }: { kind: SeeAllKind }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const { favoriteProductNames } = useFavorites();
  const { mode } = useFulfillment();
  const availableRestaurants = restaurantsForMode(mode);
  const availableProducts = productsForMode(mode, products);

  const allItems =
    kind === "new"
      ? availableProducts.filter((p) => p.isNew)
      : kind === "popular"
        ? availableProducts.filter((p) => p.isFeatured)
        : kind === "recommended"
          ? productsForMode(mode, recommendedProducts)
          : kind === "favorites"
          ? availableProducts.filter((p) => favoriteProductNames.includes(p.name))
          : [];

  const items = q ? allItems.filter((p) => matches(q, p.name, p.category, p.description)) : allItems;
  const restaurants = q
    ? availableRestaurants.filter((r) => matches(q, r.name, r.cuisine, r.zone))
    : availableRestaurants;
  const isRestaurants = kind === "restaurants";
  const shown = isRestaurants ? restaurants.length : items.length;
  const total = isRestaurants ? availableRestaurants.length : allItems.length;
  const noun = isRestaurants ? (total === 1 ? "restaurant" : "restaurants") : total === 1 ? "dish" : "dishes";

  return (
    <>
      <BackAppBar
        title={titles[kind]}
        subtitle={q ? `${shown} of ${total} ${noun}` : `${total} ${noun}`}
        trailing={
          <div className="relative w-[46%] max-w-72 shrink-0 md:w-72">
            <Icon
              name="magnifier-outline"
              size={17}
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isRestaurants ? "Search restaurants" : "Search dishes"}
              aria-label={isRestaurants ? "Search restaurants" : "Search dishes"}
              className="h-10 w-full rounded-full border border-border bg-bg ps-9 pe-8 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-amber focus:ring-2 focus:ring-amber/25 md:bg-card"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute end-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-text-muted hover:text-text"
              >
                <Icon name="close-circle-bold" size={16} />
              </button>
            )}
          </div>
        }
      />
      <Page>
        {isRestaurants ? (
          restaurants.length === 0 ? (
            q ? (
              <EmptyCard icon="magnifier-outline" title="No matching restaurants" message={`Nothing matches “${query.trim()}”.`} />
            ) : (
              <EmptyCard
                icon="shop-2-outline"
                title="No restaurants for delivery"
                message="Switch to pickup to see kitchens that don't deliver."
              />
            )
          ) : (
            <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {restaurants.map((r, i) => (
                <RestaurantCard key={r.id} restaurant={r} eager={i === 0} />
              ))}
            </div>
          )
        ) : items.length === 0 && q ? (
          <EmptyCard icon="magnifier-outline" title="No matching dishes" message={`Nothing matches “${query.trim()}”.`} />
        ) : items.length === 0 ? (
          <EmptyCard
            icon={kind === "favorites" ? "heart-outline" : "chef-hat-outline"}
            title={kind === "favorites" ? "No favorites yet" : "No dishes found"}
            message={
              kind === "favorites"
                ? "Tap the heart on a dish to save it here"
                : "Try adjusting your filters or search again"
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} grid eager={i === 0} />
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
