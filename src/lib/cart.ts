import type { CartCustomization, CartItem } from "@/data/models";

export function extraCost(c: CartCustomization) {
  return c.selected.reduce((s, i) => s + i.price, 0);
}

export function customizationSummary(item: CartItem) {
  if (item.customizations.length === 0) return item.description;
  return item.customizations
    .filter((c) => c.selected.length > 0)
    .map((c) => c.selected.map((i) => i.name).join(", "))
    .join(" · ");
}

export function unitTotal(item: CartItem) {
  return item.price + item.customizations.reduce((s, c) => s + extraCost(c), 0);
}

export function lineTotal(item: CartItem) {
  return unitTotal(item) * item.quantity;
}

export const DELIVERY_FEE = 0.5;
export const SERVICE_FEE = 3.0;
