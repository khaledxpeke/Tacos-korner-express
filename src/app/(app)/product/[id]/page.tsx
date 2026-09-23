import { notFound } from "next/navigation";
import { productById, products } from "@/data/home";
import { ProductDetailsClient } from "./ProductDetailsClient";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = productById(id);
  return { title: p ? `${p.name} · Takos Korner` : "Product · Takos Korner" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();
  return <ProductDetailsClient product={product} />;
}
