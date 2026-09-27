"use client";

import { useEffect, useState } from "react";
import { Button, SecondaryButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useFulfillment, type OrderMode } from "@/context/FulfillmentContext";
import { cn } from "@/lib/utils";
import { useBodyScrollLock, useEscapeKey } from "@/lib/useBodyScrollLock";

export type AddressHit = { label: string; lat?: number; lng?: number };

function Spinner() {
  return (
    <span
      role="status"
      aria-label="Searching"
      className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-amber/30 border-t-amber"
    />
  );
}

/** Street lookup with amber focus. Used in the header prompt and checkout. */
export function AddressSuggestField({
  id,
  value,
  onChange,
  onPick,
  autoFocus,
  placeholder = "Street, neighborhood, city",
  icon = "magnifier-outline",
  inputClassName,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onPick?: (hit: AddressHit) => void;
  autoFocus?: boolean;
  placeholder?: string;
  icon?: string;
  inputClassName?: string;
}) {
  const [hits, setHits] = useState<AddressHit[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    const query = value.trim();
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
  }, [value]);

  return (
    <div>
      <div className="relative">
        <Icon
          name={icon}
          size={18}
          className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          id={id}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => {
            const next = e.target.value;
            onChange(next);
            setHits([]);
            setStatus(next.trim().length >= 3 ? "loading" : "idle");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onPick?.({ label: value });
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={
            inputClassName ??
            "h-12 w-full rounded-full border border-border bg-card py-3 ps-11 pe-20 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-amber focus:ring-2 focus:ring-amber/25"
          }
        />
        <div className="absolute end-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {status === "loading" && <Spinner />}
        </div>
      </div>
      {(status !== "idle" || hits.length > 0) && (
        <div className="thin-scrollbar mt-2 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card shadow-card">
          {status === "loading" && hits.length === 0 && (
            <p className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted">
              <Spinner /> Looking up addresses…
            </p>
          )}
          {status === "done" && hits.length === 0 && (
            <p className="px-4 py-3 text-sm text-text-muted">
              No matching addresses. You can still save what you typed.
            </p>
          )}
          <ul className="divide-y divide-border">
            {hits.map((item) => {
              const on = value === item.label;
              const cut = item.label.indexOf(",");
              const main = cut > 0 ? item.label.slice(0, cut) : item.label;
              const rest = cut > 0 ? item.label.slice(cut + 1).trim() : "";
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(item.label);
                      onPick?.(item);
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-2.5 text-start transition",
                      on ? "bg-primary-bg" : "hover:bg-bg",
                    )}
                  >
                    <Icon
                      name={on ? "map-point-bold" : "map-point-outline"}
                      size={18}
                      className={cn("mt-0.5", on ? "text-primary" : "text-text-muted")}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-text">{main}</span>
                      {rest && <span className="block truncate text-xs text-text-muted">{rest}</span>}
                    </span>
                    {on && <Icon name="check-circle-bold" size={18} className="mt-0.5 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Delivery / pickup switch and the saved address. In the desktop header, and above the app bar on phones. */
export function FulfillmentBar({ className }: { className?: string }) {
  const { mode, address, setMode, openEditor } = useFulfillment();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex shrink-0 rounded-full border border-border bg-card p-1">
        <ModeButton mode="delivery" current={mode} icon="delivery-outline" label="Delivery" onClick={setMode} />
        <ModeButton mode="pickup" current={mode} icon="shop-bold" label="Pickup" onClick={setMode} />
      </div>
      <button
        type="button"
        onClick={openEditor}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-full px-2 py-1.5 text-start hover:bg-card md:max-w-[12rem] md:flex-none"
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
      aria-pressed={on}
      aria-label={label}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
        fill ? "h-11 w-full" : "gap-1.5 px-2.5 py-1.5",
        on ? "bg-primary text-white shadow-sm" : "text-text-body hover:bg-bg hover:text-text",
      )}
    >
      <Icon name={icon} size={18} />
      {/* Phones: the inactive mode shows only its icon so the address has room. */}
      <span className={fill || on ? undefined : "sr-only sm:not-sr-only"}>{label}</span>
    </button>
  );
}

/** Opens only when the user taps the address chip — first visit uses the welcome page. */
export function AddressPrompt() {
  const { editorOpen, closeEditor } = useFulfillment();
  useBodyScrollLock(editorOpen);
  useEscapeKey(editorOpen, closeEditor);
  if (!editorOpen) return null;
  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={closeEditor}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-labelledby="address-title"
        className="slide-up max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[24px] bg-card p-6 shadow-lg"
      >
        <AddressLookup cancelable />
      </div>
    </div>
  );
}

export function AddressLookup({
  cancelable,
  framed,
  onSaved,
}: {
  cancelable?: boolean;
  /** Boxes the form in a white card when it sits directly on the page background. */
  framed?: boolean;
  onSaved?: () => void;
}) {
  const { mode, address, closeEditor, saveAddress } = useFulfillment();
  const [draft, setDraft] = useState(address);
  const [draftMode, setDraftMode] = useState<OrderMode>(mode);
  const canSave = draft.trim().length >= 4;

  const save = (
    <Button
      title={draftMode === "delivery" ? "See restaurants nearby" : "Show pickup kitchens"}
      isDisabled={!canSave}
      onClick={() => {
        saveAddress(draft, draftMode);
        onSaved?.();
      }}
    />
  );

  return (
    <div className={cn(framed && "rounded-2xl border border-border bg-card p-5 shadow-card md:p-6")}>
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-bg text-primary">
          <Icon name="map-point-bold" size={24} />
        </div>
        {cancelable && (
          <button
            type="button"
            aria-label="Close"
            onClick={closeEditor}
            className="grid h-9 w-9 place-items-center rounded-full text-text-muted transition hover:bg-bg hover:text-text"
          >
            <Icon name="close-circle-linear" size={22} />
          </button>
        )}
      </div>
      <h2 id="address-title" className="mt-4 text-xl font-extrabold text-text">
        Where are you?
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        We need a street or neighborhood before we can show kitchens around you.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full border border-border bg-bg p-1">
        <ModeButton fill mode="delivery" current={draftMode} icon="delivery-outline" label="Delivery" onClick={setDraftMode} />
        <ModeButton fill mode="pickup" current={draftMode} icon="shop-bold" label="Pickup" onClick={setDraftMode} />
      </div>

      <label className="mt-4 block text-sm font-semibold text-text" htmlFor="delivery-address">
        Address
      </label>
      <div className="mt-1.5">
        <AddressSuggestField id="delivery-address" value={draft} onChange={setDraft} />
      </div>

      {cancelable ? (
        <div className="mt-5 grid grid-cols-[auto_1fr] gap-3">
          <SecondaryButton title="Cancel" onClick={closeEditor} className="px-6 py-3 font-bold" />
          {save}
        </div>
      ) : (
        <div className="mt-5">{save}</div>
      )}
    </div>
  );
}
