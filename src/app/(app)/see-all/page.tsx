import { SeeAllClient, type SeeAllKind } from "./SeeAllClient";

export const metadata = { title: "See all · Takos Korner" };

const kinds: SeeAllKind[] = ["new", "popular", "recommended", "favorites", "restaurants"];

export default async function SeeAllPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const k = kinds.includes(kind as SeeAllKind) ? (kind as SeeAllKind) : "popular";
  return <SeeAllClient kind={k} />;
}
