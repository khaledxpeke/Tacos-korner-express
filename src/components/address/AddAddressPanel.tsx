"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AddressSuggestField, type AddressHit } from "@/components/layout/FulfillmentBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useSnackbar } from "@/context/SnackbarContext";
import type { MapPoint } from "./AddressPickerMap";

const AddressPickerMap = dynamic(
  () => import("./AddressPickerMap").then((mod) => mod.AddressPickerMap),
  { ssr: false, loading: () => <div className="h-52 animate-pulse rounded-[12px] bg-card-blue" /> },
);

async function reversePoint(point: MapPoint) {
  const res = await fetch(`/api/addresses?lat=${point.lat}&lon=${point.lng}`);
  const data = (await res.json()) as { label?: string };
  return data.label?.trim() || `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
}

/** Search, current location, or tap the map. */
export function AddAddressPanel({
  onSave,
  onCancel,
}: {
  onSave: (line: string) => void;
  onCancel: () => void;
}) {
  const snack = useSnackbar();
  const [draft, setDraft] = useState("");
  const [pin, setPin] = useState<MapPoint | null>(null);
  const [locating, setLocating] = useState(false);
  const [looking, setLooking] = useState(false);

  async function applyPoint(point: MapPoint) {
    setPin(point);
    setLooking(true);
    try {
      setDraft(await reversePoint(point));
    } catch {
      setDraft(`${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`);
    } finally {
      setLooking(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      snack.show("Location is not available in this browser", "error");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void applyPoint({ lat: pos.coords.latitude, lng: pos.coords.longitude }).finally(() => {
          setLocating(false);
        });
      },
      () => {
        setLocating(false);
        snack.show("Could not get your location", "error");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function pickSuggestion(hit: AddressHit) {
    setDraft(hit.label);
    if (hit.lat != null && hit.lng != null) setPin({ lat: hit.lat, lng: hit.lng });
  }

  function save() {
    const line = draft.trim();
    if (line.length < 4) {
      snack.show("Search, use your location, or tap the map", "error");
      return;
    }
    onSave(line);
  }

  return (
    <div className="rounded-card border border-dashed border-border p-3">
      <p className="text-sm font-bold text-text">Other</p>
      <div className="mt-2">
        <AddressSuggestField value={draft} autoFocus onChange={setDraft} onPick={pickSuggestion} />
      </div>
      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={locating}
        className="mt-3 flex w-full items-center gap-3 rounded-card border border-amber bg-amber-bg px-3 py-2.5 text-start"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-card text-amber">
          <Icon name="gps-outline" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-text">
            {locating ? "Finding you…" : "Use current location"}
          </span>
          <span className="block text-xs text-text-muted">Recommended · we drop a pin where you are</span>
        </span>
      </button>
      <p className="mt-3 text-xs text-text-muted">Or tap the map to choose a place.</p>
      <div className="mt-2">
        <AddressPickerMap point={pin} onPick={(point) => void applyPoint(point)} />
      </div>
      {looking && <p className="mt-2 text-xs text-text-muted">Finding that address…</p>}
      <div className="mt-3 flex gap-2">
        <Button title="Save address" size="sm" onClick={save} />
        <Button title="Cancel" size="sm" isTransparent onClick={onCancel} />
      </div>
    </div>
  );
}
