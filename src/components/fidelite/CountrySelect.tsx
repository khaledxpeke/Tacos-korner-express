"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { PHONE_COUNTRIES, phoneLengthLabel, type PhoneCountry } from "@/lib/phoneCountries";

type Box = { top: number; left: number; width: number; maxHeight: number };

function flagSrc(iso: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}/flags/${iso.toLowerCase()}.png`;
}

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function place(anchor: DOMRect): Box {
  const margin = 8;
  const gap = 6;
  const width = Math.min(320, window.innerWidth - margin * 2);
  let left = anchor.left;
  if (left + width > window.innerWidth - margin) left = window.innerWidth - margin - width;
  if (left < margin) left = margin;

  const spaceBelow = window.innerHeight - anchor.bottom - margin - gap;
  const spaceAbove = anchor.top - margin - gap;
  const below = spaceBelow >= 220 || spaceBelow >= spaceAbove;
  const room = Math.max(96, below ? spaceBelow : spaceAbove);
  let maxHeight = Math.min(340, room);
  let top = below ? anchor.bottom + gap : anchor.top - gap - maxHeight;
  if (top < margin) top = margin;
  if (top + maxHeight > window.innerHeight - margin) {
    maxHeight = Math.max(96, window.innerHeight - margin - top);
  }
  return { top, left, width, maxHeight };
}

function Flag({ iso }: { iso: string }) {
  return (
    // Local flag art, sized for the row. next/image is unnecessary for these tiny static files.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagSrc(iso)}
      alt=""
      width={22}
      height={16}
      className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
    />
  );
}

export function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (iso: string) => void;
}) {
  const selected = PHONE_COUNTRIES.find((item) => item.iso === value) ?? PHONE_COUNTRIES[0];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const needle = fold(query.trim().replace(/^\+/, ""));
    if (!needle) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter((item) => {
      const haystack = fold(`${item.name} ${item.iso} ${item.dial}`);
      return haystack.includes(needle);
    });
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (!buttonRef.current) return;
      setBox(place(buttonRef.current.getBoundingClientRect()));
    };
    update();
    const frame = requestAnimationFrame(() => searchRef.current?.focus());
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open, results]);

  function choose(item: PhoneCountry) {
    onChange(item.iso);
    setOpen(false);
    setQuery("");
    buttonRef.current?.focus();
  }

  function onSearchKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const item = results[active];
      if (item) choose(item);
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Indicatif, ${selected.name} +${selected.dial}`}
        onClick={() => setOpen((current) => !current)}
        className="flex w-[118px] shrink-0 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 py-3 text-sm text-text outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/25"
      >
        <Flag iso={selected.iso} />
        <span className="min-w-0 flex-1 text-left font-semibold">+{selected.dial}</span>
        <Chevron open={open} />
      </button>
      {open && box && createPortal(
        <div
          ref={panelRef}
          style={{ top: box.top, left: box.left, width: box.width, maxHeight: box.maxHeight }}
          className="fixed z-[80] flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
        >
          <div className="border-b border-border p-2">
            <label className="relative block">
              <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
                <SearchIcon />
              </span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onSearchKey}
                placeholder="Rechercher un pays"
                aria-label="Rechercher un pays"
                className="w-full rounded-[10px] border border-border bg-bg py-2 ps-9 pe-3 text-sm text-text placeholder:text-text-muted outline-none focus:border-amber focus:ring-2 focus:ring-amber/25"
              />
            </label>
          </div>
          <ul id={listId} role="listbox" aria-label="Pays" className="min-h-0 flex-1 overflow-y-auto py-1">
            {results.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-text-muted">Aucun pays trouvé</li>
            )}
            {results.map((item, index) => {
              const isSelected = item.iso === selected.iso;
              const isActive = index === active;
              return (
                <li key={item.iso} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={index}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(item)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                      isSelected
                        ? "bg-primary-bg text-primary"
                        : isActive
                          ? "bg-bg text-text"
                          : "text-text"
                    }`}
                  >
                    <Flag iso={item.iso} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{item.name}</span>
                      <span className={`block text-xs ${isSelected ? "text-primary/70" : "text-text-muted"}`}>
                        {phoneLengthLabel(item)}
                      </span>
                    </span>
                    <span className="text-sm font-semibold">+{item.dial}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`shrink-0 text-text-muted transition ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}
