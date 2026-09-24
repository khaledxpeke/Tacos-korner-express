import { products, restaurantOf } from "@/data/home";
import type { CartItem, OrderModel } from "@/data/models";

/** Map a past order onto cart lines using the live menu prices. */
export function cartItemsFromOrder(order: OrderModel): CartItem[] {
  return order.items.map((line, i) => {
    const product = products.find((p) => p.name === line.name);
    const restaurant = product ? restaurantOf(product) : undefined;
    return {
      id: `${order.id}_${line.name}_${i}`,
      productId: product?.id,
      name: line.name,
      description: product?.description ?? `From ${order.restaurantName}`,
      price: product?.price ?? 0,
      imageUrl: product?.image ?? line.imageUrl,
      restaurantName: restaurant?.name ?? order.restaurantName,
      quantity: line.quantity,
      customizations: [],
    };
  });
}
