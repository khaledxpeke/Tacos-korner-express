"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSnackbar } from "@/context/SnackbarContext";
import { restaurantById } from "@/data/home";
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
  const snack = useSnackbar();

  return (
    <Ctx.Provider
      value={{
        favoriteProductNames: productNames,
        favoriteRestaurantIds: restaurantIds,
        count: productNames.length + restaurantIds.length,
        isProductFavorite: (n) => productNames.includes(n),
        isRestaurantFavorite: (id) => restaurantIds.includes(id),
        toggleProduct: (n) => {
          const removing = productNames.includes(n);
          setProductNames((prev) =>
            prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
          );
          snack.show(
            removing ? `${n} removed from favorites` : `${n} added to favorites`,
            removing ? "info" : "success",
          );
        },
        toggleRestaurant: (id) => {
          const name = restaurantById(id)?.name ?? "Restaurant";
          const removing = restaurantIds.includes(id);
          setRestaurantIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          );
          snack.show(
            removing ? `${name} removed from favorites` : `${name} added to favorites`,
            removing ? "info" : "success",
          );
        },
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
