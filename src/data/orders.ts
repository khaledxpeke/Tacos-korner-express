import type { OrderModel, OrderStatus } from "./models";

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  onTheWay: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const activeStatuses: OrderStatus[] = ["pending", "preparing", "onTheWay"];

export const orders: OrderModel[] = [
  {
    id: "TK-2847",
    restaurantName: "Smash & Stack",
    restaurantImage:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80",
    items: [
      {
        name: "Classic Smash Burger",
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
      },
      {
        name: "Mango Lassi",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&q=80",
      },
    ],
    total: 32.48,
    status: "onTheWay",
    date: "Today, 12:40 PM",
  },
  {
    id: "TK-2831",
    restaurantName: "Luigi's Pizzeria",
    restaurantImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80",
    items: [
      {
        name: "Margherita Classica",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80",
      },
    ],
    total: 14.0,
    status: "preparing",
    date: "Today, 11:15 AM",
  },
  {
    id: "TK-2790",
    restaurantName: "Sushi Omakase",
    restaurantImage:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80",
    items: [
      {
        name: "Spicy Tuna Roll (8pc)",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&q=80",
      },
      {
        name: "Dragon Roll (8pc)",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&q=80",
      },
    ],
    total: 37.5,
    status: "delivered",
    date: "Yesterday, 7:20 PM",
  },
  {
    id: "TK-2755",
    restaurantName: "Taco Loco",
    restaurantImage:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80",
    items: [
      {
        name: "Street Tacos Trio",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80",
      },
    ],
    total: 11.99,
    status: "delivered",
    date: "3 days ago",
  },
  {
    id: "TK-2701",
    restaurantName: "Dessert Lab",
    restaurantImage:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80",
    items: [
      {
        name: "Nutella Lava Cake",
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80",
      },
    ],
    total: 17.0,
    status: "cancelled",
    date: "1 week ago",
  },
];
