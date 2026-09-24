import { restaurants } from "@/data/home";
import type { ProductModel, RestaurantModel } from "@/data/models";

export type OrderMode = "delivery" | "pickup";

export function offersDelivery(restaurant: RestaurantModel) {
  return restaurant.offersDelivery !== false;
}

/** Pickup lists every kitchen. Delivery hides pickup-only ones. */
export function restaurantsForMode(mode: OrderMode, list: RestaurantModel[] = restaurants) {
  return mode === "pickup" ? list : list.filter(offersDelivery);
}

export function productsForMode(mode: OrderMode, list: ProductModel[]) {
  if (mode === "pickup") return list;
  const hidden = new Set(restaurants.filter((r) => !offersDelivery(r)).map((r) => r.id));
  return list.filter((p) => !hidden.has(p.restaurantId));
}

/** Home chip: cuisine name, or the kitchen actually serves that category. */
export function restaurantMatchesCategory(
  restaurant: RestaurantModel,
  category: string | null,
  menu: ProductModel[],
) {
  if (!category) return true;
  const needle = category.toLowerCase();
  if (restaurant.cuisine.toLowerCase().includes(needle) || restaurant.name.toLowerCase().includes(needle)) {
    return true;
  }
  return menu.some((p) => p.restaurantId === restaurant.id && p.category.toLowerCase() === needle);
}
