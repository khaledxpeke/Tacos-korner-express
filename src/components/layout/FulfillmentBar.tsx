"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useFulfillment, type OrderMode } from "@/context/FulfillmentContext";
import { cn } from "@/lib/utils";

type AddressHit = { label: string };

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Searching"
      className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-amber/30 border-t-amber"
    />
  );
}

/** Delivery / pickup switch and the saved address. In the desktop header, and above the app bar on phones. */
export function FulfillmentBar({ className }: { className?: string }) {
  const { mode, address, setMode, openEditor } = useFulfillment();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex shrink-0 rounded-full bg-card-gray p-1">
        <ModeButton mode="delivery" current={mode} icon="delivery-outline" label="Delivery" onClick={setMode} />
        <ModeButton mode="pickup" current={mode} icon="shop-bold" label="Pickup" onClick={setMode} />
      </div>
      <button
        type="button"
        onClick={openEditor}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-2 py-1.5 text-start hover:bg-card-gray md:max-w-[12rem] md:flex-none"
      >
        <Icon name="map-point-bold" size={18} className="shrink-0 text-primary" />
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold leading-none text-text-muted">
            {mode === "delivery" ? "Deliver to" : "Pickup near"}
          </span>
          <span className="mt-0.5 block truncate text-sm font-bold text-text">
            {address || "Add your address"}
          </span>
        </span>
        <Icon name="alt-arrow-down-outline" size={16} className="shrink-0 text-text-muted" />
      </button>
    </div>
  );
}

function ModeButton({
  mode,
  current,
  icon,
  label,
  onClick,
  fill,
}: {
  mode: OrderMode;
  current: OrderMode;
  icon: string;
  label: string;
  onClick: (mode: OrderMode) => void;
  fill?: boolean;
}) {
  const on = mode === current;
  return (
    <button
      type="button"
      onClick={() => onClick(mode)}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
        fill ? "h-11 w-full" : "gap-1.5 px-2.5 py-1.5",
        on ? "bg-card text-text shadow-card" : "text-text-muted hover:text-text",
      )}
    >
      <Icon name={icon} size={18} className={on ? "text-primary" : undefined} />
      {label}
    </button>
  );
}

/** Asks for an address after sign-in or Continue as guest, and when the address chip is opened. */
export function AddressPrompt() {
  const ctx = useFulfillment();
  const open = ctx.needsAddress || ctx.editorOpen;
  if (!open) return null;
  return <AddressForm />;
}

function AddressForm() {
  const { mode, address, needsAddress, closeEditor, saveAddress } = useFulfillment();
  const [draft, setDraft] = useState(address);
  const [draftMode, setDraftMode] = useState<OrderMode>(mode);
  const [hits, setHits] = useState<AddressHit[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const canSave = draft.trim().length >= 4;

  useEffect(() => {
    const query = draft.trim();
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setHits([]);
        setStatus("idle");
        return;
      }
      setStatus("loading");
      try {
        const res = await fetch(`/api/addresses?q=${encodeURIComponent(query)}`, { signal: ctrl.signal });
        const data = (await res.json()) as AddressHit[];
        if (!ctrl.signal.aborted) setHits(Array.isArray(data) ? data : []);
      } catch {
        if (!ctrl.signal.aborted) setHits([]);
      } finally {
        if (!ctrl.signal.aborted) setStatus("done");
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [draft]);

  return (
    <div className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="address-title"
        className="w-full max-w-md rounded-[24px] bg-card p-6 shadow-lg"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-bg text-primary">
          <Icon name="map-point-bold" size={24} />
        </div>
        <h2 id="address-title" className="mt-4 text-xl font-extrabold text-text">
          Where are you?
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Delivery hides kitchens that only offer pickup. Pickup shows every restaurant.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-card-gray p-1">
          <ModeButton fill mode="delivery" current={draftMode} icon="delivery-outline" label="Delivery" onClick={setDraftMode} />
          <ModeButton fill mode="pickup" current={draftMode} icon="shop-bold" label="Pickup" onClick={setDraftMode} />
        </div>

        <label className="mt-4 block text-sm font-semibold text-text" htmlFor="delivery-address">
          Address
        </label>
        <div className="relative mt-1.5">
          <input
            id="delivery-address"
            value={draft}
            onChange={(e) => {
              const next = e.target.value;
              setDraft(next);
              setHits([]);
              setStatus(next.trim().length >= 3 ? "loading" : "idle");
            }}
            placeholder="Street, neighborhood, city"
            autoComplete="off"
            className="h-12 w-full rounded-[12px] border border-border bg-bg px-4 pe-20 text-sm text-text outline-none focus:border-amber focus:ring-2 focus:ring-amber/25"
          />
          <div className="absolute end-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {status === "loading" && <Spinner />}
            {draft.length > 0 && (
              <button
                type="button"
                aria-label="Clear address"
                onClick={() => {
                  setDraft("");
                  setHits([]);
                  setStatus("idle");
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-text-muted hover:bg-card-gray hover:text-text"
              >
                <Icon name="close-circle-bold" size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex max-h-56 flex-col gap-2 overflow-y-auto">
          {status === "loading" && hits.length === 0 && (
            <p className="px-1 text-sm text-text-muted">Looking up addresses…</p>
          )}
          {status === "done" && hits.length === 0 && (
            <p className="px-1 text-sm text-text-muted">No matching addresses. You can still save what you typed.</p>
          )}
          {hits.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setDraft(item.label)}
              className={cn(
                "rounded-[12px] border px-3 py-2.5 text-start text-sm",
                draft === item.label
                  ? "border-primary bg-primary-bg font-semibold text-text"
                  : "border-border text-text-body hover:border-primary",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Button
          title={draftMode === "delivery" ? "Deliver here" : "Use this area"}
          className="mt-5"
          isDisabled={!canSave}
          onClick={() => saveAddress(draft, draftMode)}
        />
        {!needsAddress && (
          <button
            type="button"
            onClick={closeEditor}
            className="mt-3 w-full py-2 text-sm font-semibold text-text-muted"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
