import { notFound } from "next/navigation";
import { restaurantById, restaurants } from "@/data/home";
import { RestaurantDetailsClient } from "./RestaurantDetailsClient";

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = restaurantById(id);
  return { title: r ? `${r.name} · Takos Korner` : "Restaurant · Takos Korner" };
}

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = restaurantById(id);
  if (!restaurant) notFound();
  return <RestaurantDetailsClient restaurant={restaurant} />;
}
