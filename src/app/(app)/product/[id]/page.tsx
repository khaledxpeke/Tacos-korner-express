import { redirect } from "next/navigation";

/** Dishes open straight in the builder; keep old /product/[id] links working. */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/product/${id}/customize`);
}
