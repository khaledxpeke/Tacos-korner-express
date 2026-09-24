"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RestaurantModel } from "@/data/models";

function pin(image: string) {
  return L.divIcon({
    className: "pickup-pin",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `<img src="${image.replace(/"/g, "&quot;")}" alt="" style="display:block;width:40px;height:40px;border-radius:999px;object-fit:cover;border:3px solid #fff;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.28)" />`,
  });
}

function mapsUrl(restaurant: RestaurantModel) {
  return `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`;
}

/** Compact Leaflet map for a single kitchen. Opens Google Maps on click. */
export function RestaurantMiniMap({ restaurant }: { restaurant: RestaurantModel }) {
  const center: L.LatLngExpression = [restaurant.lat, restaurant.lng];

  return (
    <div className="resto-minimap relative h-44 w-full">
      <MapContainer
        center={center}
        zoom={15}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        className="h-full w-full"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} icon={pin(restaurant.image)} />
      </MapContainer>
      <a
        href={mapsUrl(restaurant)}
        target="_blank"
        rel="noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`Open ${restaurant.name} in Google Maps`}
      />
      <span className="pointer-events-none absolute bottom-2 end-2 z-20 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-text shadow-sm">
        Open map
      </span>
    </div>
  );
}
