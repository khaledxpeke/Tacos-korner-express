import { notFound } from "next/navigation";
import { restaurantById, restaurants } from "@/data/home";
import { ReviewsClient } from "./ReviewsClient";

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = restaurantById(id);
  return { title: r ? `Reviews · ${r.name}` : "Reviews · Takos Korner" };
}

export default async function ReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = restaurantById(id);
  if (!restaurant) notFound();
  return <ReviewsClient restaurant={restaurant} />;
}
