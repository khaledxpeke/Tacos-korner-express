import { notFound } from "next/navigation";
import { productById, products } from "@/data/home";
import { CustomizerClient } from "./CustomizerClient";

export function generateStaticParams() {
  return products.filter((p) => p.isCustomizable).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = productById(id);
  return { title: p ? `Customize ${p.name} · Takos Korner` : "Customize · Takos Korner" };
}

export default async function CustomizePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const product = productById(id);
  if (!product) notFound();
  return <CustomizerClient product={product} editId={edit ?? null} />;
}
