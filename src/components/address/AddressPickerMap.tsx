"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TUNIS: L.LatLngExpression = [36.8065, 10.1815];

export type MapPoint = { lat: number; lng: number };

function pinIcon() {
  return L.divIcon({
    className: "pickup-pin",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C7.373 0 2 5.26 2 11.75c0 8.25 12 24.25 12 24.25S26 20 26 11.75C26 5.26 20.627 0 14 0Z" fill="#EC1D23"/><circle cx="14" cy="12" r="4.5" fill="#fff"/></svg>`,
  });
}

function ClickCatch({ onPick }: { onPick: (point: MapPoint) => void }) {
  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });
  return null;
}

function Recenter({ point }: { point: MapPoint | null }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (!point) return;
    map.flyTo([point.lat, point.lng], 16, { duration: 0.45 });
  }, [map, point]);
  return null;
}

/** Tap the map to drop a delivery pin. */
export function AddressPickerMap({
  point,
  onPick,
}: {
  point: MapPoint | null;
  onPick: (point: MapPoint) => void;
}) {
  return (
    <div className="address-picker-map h-52 w-full overflow-hidden rounded-[12px] border border-border">
      <MapContainer
        center={point ? [point.lat, point.lng] : TUNIS}
        zoom={point ? 16 : 12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatch onPick={onPick} />
        <Recenter point={point} />
        {point && <Marker position={[point.lat, point.lng]} icon={pinIcon()} />}
      </MapContainer>
    </div>
  );
}
