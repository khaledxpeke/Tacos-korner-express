"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface FavoritesCtx {
  favoriteProductNames: string[];
  favoriteRestaurantIds: number[];
  count: number;
  isProductFavorite: (name: string) => boolean;
  isRestaurantFavorite: (id: number) => boolean;
  toggleProduct: (name: string) => void;
  toggleRestaurant: (id: number) => void;
}

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [productNames, setProductNames] = useLocalStorage<string[]>(
    "favorite_products",
    [],
  );
  const [restaurantIds, setRestaurantIds] = useLocalStorage<number[]>(
    "favorite_restaurants",
    [],
  );

  return (
    <Ctx.Provider
      value={{
        favoriteProductNames: productNames,
        favoriteRestaurantIds: restaurantIds,
        count: productNames.length + restaurantIds.length,
        isProductFavorite: (n) => productNames.includes(n),
        isRestaurantFavorite: (id) => restaurantIds.includes(id),
        toggleProduct: (n) =>
          setProductNames((prev) =>
            prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
          ),
        toggleRestaurant: (id) =>
          setRestaurantIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          ),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFavorites() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFavorites outside FavoritesProvider");
  return v;
}
