"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { AddressSuggestField } from "@/components/layout/FulfillmentBar";
import { Dropdown, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { SelectableChip } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { allergenOptions } from "@/data/home";
import { cn } from "@/lib/utils";

/** Mirrors `auth_header.dart`: gradient header with rounded bottom corners. */
export function AuthHeader({
  title,
  subtitle,
  gradient = "from-primary to-primary-dark",
  showBack,
  onBack,
  footer,
}: {
  title: string;
  subtitle: string;
  gradient?: string;
  showBack?: boolean;
  onBack?: () => void;
  footer?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "rounded-b-[28px] bg-gradient-to-br px-7 pb-9 pt-14 text-white md:rounded-none md:bg-transparent md:bg-none md:px-0 md:pb-2 md:pt-0 md:text-text",
        gradient,
      )}
    >
      <div className="flex items-center gap-2.5">
        {showBack && (
          <button
            type="button"
            aria-label="Back"
            onClick={onBack ?? (() => router.back())}
            className="grid h-9 w-9 place-items-center rounded-[10px] bg-white/25 text-white md:bg-card-gray md:text-text"
          >
            <Icon name="alt-arrow-left-outline" size={18} className="rtl:rotate-180" />
          </button>
        )}
        <h1 className="text-[26px] font-extrabold">{title}</h1>
      </div>
      <p className="mt-1.5 text-sm text-white/70 md:text-text-muted">{subtitle}</p>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

/** Mirrors `otp_box.dart`: 6 single-digit cells. */
export function OtpBoxes({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function set(i: number, d: string) {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join(""));
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  }

  return (
    <div className="flex justify-between gap-2" dir="ltr">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={d}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => set(i, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus();
          }}
          className={cn(
            "h-13 w-11 rounded-[12px] border bg-card text-center text-xl font-bold text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15",
            d ? "border-primary" : "border-border",
          )}
        />
      ))}
    </div>
  );
}

/** Mirrors `step_progress_bar.dart`. */
export function StepProgressBar({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels?: string[];
}) {
  return (
    <div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex justify-between text-[11px] font-semibold">
          {labels.map((l, i) => (
            <span key={l} className={i === step ? "text-primary" : "text-text-muted"}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Mirrors `social_button.dart`. */
export function SocialButton({
  provider,
  onClick,
}: {
  provider: "google" | "facebook" | "apple";
  onClick?: () => void;
}) {
  const labels = { google: "Google", facebook: "Facebook", apple: "Apple" };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Continue with ${labels[provider]}`}
      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[12px] border border-border bg-card px-2 shadow-card"
    >
      <Image src={`/images/${provider}.png`} alt="" width={20} height={20} />
      <span className="text-sm font-normal text-text">{labels[provider]}</span>
    </button>
  );
}

export function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

/** Mirrors `password_strength_bar.dart`. */
export function PasswordStrengthBar({ password }: { password: string }) {
  const s = passwordStrength(password);
  const colors = ["bg-border", "bg-danger", "bg-warning", "bg-blue", "bg-green"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn("h-1 flex-1 rounded-full", i <= s ? colors[s] : "bg-border")}
          />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-text-muted">{labels[s]}</p>
    </div>
  );
}

export interface AddressForm {
  label: string;
  street: string;
  city: string;
  postalCode: string;
  notes: string;
}

export const cities = [
  "Tunis",
  "Ariana",
  "La Marsa",
  "Carthage",
  "Le Bardo",
  "Ben Arous",
  "Sousse",
  "Sfax",
];

/** Mirrors `address_form_fields.dart`. */
export function AddressFormFields({
  value,
  onChange,
}: {
  value: AddressForm;
  onChange: (v: AddressForm) => void;
}) {
  const set = (k: keyof AddressForm) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {["Home", "Work", "Other"].map((l) => (
          <SelectableChip
            key={l}
            label={l}
            icon={l === "Home" ? "home-2-outline" : l === "Work" ? "case-outline" : "map-point-outline"}
            selected={value.label === l}
            onClick={() => set("label")(l)}
          />
        ))}
      </div>
      <div>
        <span className="mb-1.5 block text-xs font-semibold text-text-body">Street address</span>
        <AddressSuggestField
          value={value.street}
          onChange={(street) => onChange({ ...value, street })}
          placeholder="Start typing a street or neighborhood"
          icon="map-point-outline"
          inputClassName="h-12 w-full rounded-[12px] border border-border bg-card py-3 ps-11 pe-10 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-amber focus:ring-2 focus:ring-amber/25"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Dropdown
          label="City"
          placeholder="Select"
          value={value.city}
          onChange={(e) => set("city")(e.target.value)}
          options={cities.map((c) => ({ value: c, label: c }))}
        />
        <TextField
          label="Postal code"
          inputMode="numeric"
          placeholder="1053"
          value={value.postalCode}
          onChange={(e) => set("postalCode")(e.target.value)}
        />
      </div>
      <TextField
        label="Delivery notes (optional)"
        icon="notes-outline"
        placeholder="Floor 3, ring twice"
        value={value.notes}
        onChange={(e) => set("notes")(e.target.value)}
      />
    </div>
  );
}

const allergenImages: Record<string, string> = {
  Gluten: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
  Dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80",
  Nuts: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200&q=80",
  Egg: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&q=80",
  Fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80",
  Shellfish: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&q=80",
  Soy: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=200&q=80",
  Sesame: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&q=80",
  Peanuts: "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?w=200&q=80",
};

const extraAllergens = ["Peanuts", "Mustard", "Celery"];

/** Mirrors `allergy_selector.dart`, with a photo on each allergen. */
export function AllergySelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const known = [...allergenOptions, ...extraAllergens];
  const custom = value.filter((name) => !known.includes(name));
  const q = query.trim().toLowerCase();
  const suggestions = known.filter(
    (name) => !value.includes(name) && (q.length === 0 || name.toLowerCase().includes(q)),
  );

  function toggle(name: string) {
    onChange(value.includes(name) ? value.filter((x) => x !== name) : [...value, name]);
  }

  function addCustom(name: string) {
    const next = name.trim();
    if (!next) return;
    if (!value.some((item) => item.toLowerCase() === next.toLowerCase())) onChange([...value, next]);
    setQuery("");
    setAdding(false);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {allergenOptions.map((name) => {
          const on = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(name)}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl border p-2 text-start transition",
                on ? "border-primary bg-primary-bg" : "border-border bg-card hover:border-text-muted",
              )}
            >
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                <SafeImage src={allergenImages[name]} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-text">{name}</span>
                <span className={cn("text-[11px] font-semibold", on ? "text-primary" : "text-text-muted")}>
                  {on ? "Selected" : "Tap to add"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {(custom.length > 0 || adding) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {custom.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary-bg px-3 py-1.5 text-xs font-bold text-primary"
            >
              {name}
              <Icon name="close-outline" size={12} />
            </button>
          ))}
        </div>
      )}

      {adding ? (
        <div className="mt-3">
          <input
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom(suggestions[0] ?? query);
              }
            }}
            placeholder="Type an allergy"
            className="h-11 w-full rounded-[12px] border border-border bg-card px-4 text-sm text-text outline-none placeholder:text-text-muted focus:border-amber focus:ring-2 focus:ring-amber/25"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => addCustom(name)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pe-3 ps-1 text-xs font-semibold text-text hover:border-primary"
              >
                {allergenImages[name] ? (
                  <span className="relative h-6 w-6 overflow-hidden rounded-full">
                    <SafeImage src={allergenImages[name]} alt="" fill sizes="24px" className="object-cover" />
                  </span>
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-card-gray text-[10px] font-bold">
                    {name.slice(0, 1)}
                  </span>
                )}
                {name}
              </button>
            ))}
            {q.length > 1 && !known.some((name) => name.toLowerCase() === q) && (
              <button
                type="button"
                onClick={() => addCustom(query)}
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark"
              >
                Add “{query.trim()}”
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-bold text-text-body hover:border-primary hover:text-primary"
        >
          <Icon name="add-circle-outline" size={15} />
          Add another
        </button>
      )}
    </div>
  );
}
