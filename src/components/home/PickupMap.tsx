"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FavoriteHeart } from "@/components/ui/FavoriteHeart";
import { Icon } from "@/components/ui/Icon";
import { useFavorites } from "@/context/FavoritesContext";
import type { RestaurantModel } from "@/data/models";

/** Avenue Habib Bourguiba, the default pickup area, used to estimate distance. */
const NEAR: L.LatLngTuple = [36.8004, 10.1866];
const TUNIS: L.LatLngExpression = [36.82, 10.2];

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}

function logoIcon(image: string, active: boolean) {
  const size = active ? 52 : 40;
  const ring = active ? "box-shadow:0 0 0 3px #EC1D23,0 2px 8px rgba(0,0,0,.28)" : "box-shadow:0 2px 8px rgba(0,0,0,.28)";
  return L.divIcon({
    className: "pickup-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<img src="${escapeHtml(image)}" alt="" style="display:block;width:${size}px;height:${size}px;border-radius:999px;object-fit:cover;border:3px solid #fff;background:#fff;${ring}" />`,
  });
}

function distanceKm(restaurant: RestaurantModel) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(restaurant.lat - NEAR[0]);
  const dLng = toRad(restaurant.lng - NEAR[1]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(NEAR[0])) * Math.cos(toRad(restaurant.lat)) * Math.sin(dLng / 2) ** 2;
  const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

function PinCard({
  restaurant,
  onOpen,
}: {
  restaurant: RestaurantModel;
  onOpen: (restaurant: RestaurantModel) => void;
}) {
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const saved = isRestaurantFavorite(restaurant.id);
  const kind = restaurant.offersDelivery === false ? "Pickup only" : restaurant.cuisine.split("·")[0].trim();

  return (
    <div className="w-[248px] bg-card text-start">
      <div className="relative h-[132px]">
        {/* Plain img: the map popup is outside Next's image layout. */}
        <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
          onClick={(event) => {
            event.stopPropagation();
            toggleRestaurant(restaurant.id);
          }}
          className="group/fav absolute end-2.5 top-2.5 drop-shadow-md"
        >
          <FavoriteHeart saved={saved} />
        </button>
      </div>
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onOpen(restaurant);
        }}
        className="block w-full px-3 py-2.5 text-start"
      >
        <span className="flex items-start justify-between gap-2">
          <span className="line-clamp-1 text-[15px] font-extrabold text-text">{restaurant.name}</span>
          <span className="shrink-0 rounded-md bg-card-gray px-1.5 py-0.5 text-xs font-bold text-text">
            {restaurant.rating}
          </span>
        </span>
        <span className="mt-1 block text-xs text-text-muted">
          {restaurant.deliveryTime} · {distanceKm(restaurant)} · {kind}
        </span>
      </button>
    </div>
  );
}

function LogoPin({
  restaurant,
  active,
  onSelect,
  onOpen,
}: {
  restaurant: RestaurantModel;
  active: boolean;
  onSelect: (restaurant: RestaurantModel) => void;
  onOpen: (restaurant: RestaurantModel) => void;
}) {
  const marker = useRef<L.Marker>(null);
  const map = useMap();
  const icon = useMemo(() => logoIcon(restaurant.image, active), [restaurant.image, active]);

  useEffect(() => {
    const pin = marker.current;
    if (!active || !pin) return;
    pin.openPopup();
    map.panInside(pin.getLatLng(), {
      paddingTopLeft: [150, 220],
      paddingBottomRight: [150, 48],
    });
  }, [active, map]);

  return (
    <Marker
      ref={marker}
      position={[restaurant.lat, restaurant.lng]}
      icon={icon}
      zIndexOffset={active ? 500 : 0}
      eventHandlers={{ click: () => onSelect(restaurant) }}
    >
      <Popup
        className="pickup-popup"
        closeButton={false}
        minWidth={248}
        maxWidth={248}
        autoPan
        autoPanPadding={[24, 24]}
      >
        <PinCard restaurant={restaurant} onOpen={onOpen} />
      </Popup>
    </Marker>
  );
}

function Frame({ restaurants }: { restaurants: RestaurantModel[] }) {
  const map = useMap();
  const list = useRef(restaurants);
  list.current = restaurants;
  const signature = restaurants.map((r) => r.id).join(",");

  useEffect(() => {
    map.invalidateSize();
    const current = list.current;
    if (current.length === 0) {
      map.setView(TUNIS, 12);
      return;
    }
    const bounds = L.latLngBounds(current.map((r) => [r.lat, r.lng] as L.LatLngTuple));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [map, signature]);

  return null;
}

/** OpenStreetMap of pickup kitchens. Loaded only in the browser. */
export function PickupMap({
  restaurants,
  activeId,
  onSelect,
  onOpen,
}: {
  restaurants: RestaurantModel[];
  activeId: number | null;
  onSelect: (restaurant: RestaurantModel) => void;
  onOpen: (restaurant: RestaurantModel) => void;
}) {
  const tiles = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="pickup-map h-full w-full">
      <MapContainer
        center={TUNIS}
        zoom={12}
        zoomControl={false}
        className="h-full w-full"
        scrollWheelZoom
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tiles}
        />
        <Frame restaurants={restaurants} />
        {restaurants.map((restaurant) => (
          <LogoPin
            key={restaurant.id}
            restaurant={restaurant}
            active={restaurant.id === activeId}
            onSelect={onSelect}
            onOpen={onOpen}
          />
        ))}
      </MapContainer>
    </div>
  );
}
