import { NextRequest, NextResponse } from "next/server";

type PhotonFeature = {
  properties?: {
    name?: string;
    street?: string;
    locality?: string;
    district?: string;
    city?: string;
    country?: string;
    countrycode?: string;
  };
};

/** Tunis, so nearby streets rank ahead of same-named places abroad. */
const TUNIS = { lat: "36.8065", lon: "10.1815" };

function labelOf(feature: PhotonFeature) {
  const p = feature.properties ?? {};
  const parts = [p.name, p.street, p.locality, p.district, p.city, p.country].filter(
    (part): part is string => Boolean(part),
  );
  return [...new Set(parts)].join(", ");
}

/** Live street suggestions. Photon is OpenStreetMap search with a location bias, no API key. */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 120) return NextResponse.json([]);

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "fr");
  url.searchParams.set("lat", TUNIS.lat);
  url.searchParams.set("lon", TUNIS.lon);

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return NextResponse.json([]);
    const data = (await res.json()) as { features?: PhotonFeature[] };
    const features = [...(data.features ?? [])].sort((a, b) => {
      const aLocal = a.properties?.countrycode === "TN" ? 0 : 1;
      const bLocal = b.properties?.countrycode === "TN" ? 0 : 1;
      return aLocal - bLocal;
    });
    const labels = [...new Set(features.map(labelOf).filter((label) => label.length > 0))].slice(0, 6);
    return NextResponse.json(labels.map((label) => ({ label })));
  } catch {
    return NextResponse.json([]);
  }
}
