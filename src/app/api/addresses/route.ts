import { NextRequest, NextResponse } from "next/server";

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
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

type AddressHit = { label: string; lat?: number; lng?: number };

/** Tunis, so nearby streets rank ahead of same-named places abroad. */
const TUNIS = { lat: "36.8065", lon: "10.1815" };

function labelOf(feature: PhotonFeature) {
  const p = feature.properties ?? {};
  const parts = [p.name, p.street, p.locality, p.district, p.city, p.country].filter(
    (part): part is string => Boolean(part),
  );
  return [...new Set(parts)].join(", ");
}

function hitOf(feature: PhotonFeature): AddressHit | null {
  const label = labelOf(feature);
  if (!label) return null;
  const coords = feature.geometry?.coordinates;
  return {
    label,
    lat: coords?.[1],
    lng: coords?.[0],
  };
}

async function photon(url: URL) {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return [] as PhotonFeature[];
  const data = (await res.json()) as { features?: PhotonFeature[] };
  return data.features ?? [];
}

/** Reverse a map pin or GPS point into a street label. */
async function reverse(lat: string, lon: string) {
  const url = new URL("https://photon.komoot.io/reverse");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("lang", "fr");
  const features = await photon(url);
  const hit = features.map(hitOf).find((item) => item?.label);
  const parsedLat = Number(lat);
  const parsedLng = Number(lon);
  return NextResponse.json({
    label: hit?.label ?? `${parsedLat.toFixed(5)}, ${parsedLng.toFixed(5)}`,
    lat: hit?.lat ?? parsedLat,
    lng: hit?.lng ?? parsedLng,
  });
}

/** Live street suggestions, or reverse geocode with lat/lon. Photon, no API key. */
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat")?.trim() ?? "";
  const lon = (req.nextUrl.searchParams.get("lon") ?? req.nextUrl.searchParams.get("lng"))?.trim() ?? "";
  if (lat && lon) {
    const parsedLat = Number(lat);
    const parsedLng = Number(lon);
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return NextResponse.json({ label: "" });
    try {
      return await reverse(lat, lon);
    } catch {
      return NextResponse.json({ label: `${parsedLat.toFixed(5)}, ${parsedLng.toFixed(5)}`, lat: parsedLat, lng: parsedLng });
    }
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 120) return NextResponse.json([]);

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "fr");
  url.searchParams.set("lat", TUNIS.lat);
  url.searchParams.set("lon", TUNIS.lon);

  try {
    const features = [...(await photon(url))].sort((a, b) => {
      const aLocal = a.properties?.countrycode === "TN" ? 0 : 1;
      const bLocal = b.properties?.countrycode === "TN" ? 0 : 1;
      return aLocal - bLocal;
    });
    const hits: AddressHit[] = [];
    for (const feature of features) {
      const hit = hitOf(feature);
      if (!hit || hits.some((item) => item.label === hit.label)) continue;
      hits.push(hit);
      if (hits.length === 6) break;
    }
    return NextResponse.json(hits);
  } catch {
    return NextResponse.json([]);
  }
}
