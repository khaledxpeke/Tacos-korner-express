"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { AddressSuggestField } from "@/components/layout/FulfillmentBar";
import { Dropdown, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { SelectableChip } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { addressTypes } from "@/context/AddressBookContext";
import { allergenOptions } from "@/data/home";
import { cn } from "@/lib/utils";

/** Mirrors `auth_header.dart`: brand gradient header with rounded bottom corners, the same on every auth screen. */
export function AuthHeader({
  title,
  subtitle,
  showBack,
  onBack,
  footer,
}: {
  title: string;
  subtitle: string;
  showBack?: boolean;
  onBack?: () => void;
  footer?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="rounded-b-[28px] bg-linear-to-br from-primary to-primary-dark px-7 pb-9 pt-14 text-white md:rounded-none md:bg-transparent md:bg-none md:px-0 md:pb-2 md:pt-0 md:text-text">
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
            "h-13 w-11 rounded-[12px] border bg-card text-center text-xl font-bold text-text outline-none focus:border-amber focus:ring-2 focus:ring-amber/25",
            d ? "border-amber" : "border-border",
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

export const passwordRules = [
  { label: "At least 8 characters", hint: "Password must contain at least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter", hint: "Add an uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", hint: "Add a lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "One number", hint: "Add a number", test: (pw: string) => /[0-9]/.test(pw) },
  { label: "One special character", hint: "Add a special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

/** Number of rules met, 0..5. */
export function passwordStrength(pw: string) {
  return passwordRules.filter((r) => r.test(pw)).length;
}

/** Length is mandatory; beyond that, three of the five rules is enough. */
export function isPasswordAcceptable(pw: string) {
  return pw.length >= 8 && passwordStrength(pw) >= 3;
}

/**
 * Strength meter plus a live checklist. Hidden until the user starts typing,
 * so it sits directly under the password field without cluttering the empty form.
 */
export function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const met = passwordStrength(password);
  // Five rules onto four segments: 1–2 weak, 3 fair, 4 good, 5 strong.
  const level = met <= 2 ? 1 : met - 1;
  const tone = ["", "danger", "warning", "blue", "green"][level];
  const bar = { danger: "bg-danger", warning: "bg-warning", blue: "bg-blue", green: "bg-green" }[tone]!;
  const text = { danger: "text-danger", warning: "text-warning", blue: "text-blue", green: "text-green" }[tone]!;
  const firstMissing = passwordRules.find((r) => !r.test(password));

  return (
    <div className="mt-2.5" aria-live="polite">
      <p className={cn("text-sm", firstMissing ? text : "text-green")}>
        {firstMissing ? firstMissing.hint : "Great, that's a strong password"}
      </p>
      <div className="mt-1.5 flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= level ? bar : "bg-border")} />
        ))}
      </div>
      <p className="mt-1.5 text-xs font-semibold text-text-muted">{["", "Weak", "Fair", "Good", "Strong"][level]}</p>
      <ul className="mt-2 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {passwordRules.map((r) => {
          const ok = r.test(password);
          return (
            <li
              key={r.label}
              className={cn("flex items-center gap-2 text-sm transition-colors", ok ? "text-text" : "text-text-muted")}
            >
              <Icon
                name={ok ? "check-circle-bold" : "close-circle-outline"}
                size={16}
                className={ok ? "text-green" : "text-text-muted-light"}
              />
              {r.label}
            </li>
          );
        })}
      </ul>
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
const defaultAddressTypes = addressTypes;

export function AddressFormFields({
  value,
  onChange,
  types = defaultAddressTypes,
  disabledTypes = [],
}: {
  value: AddressForm;
  onChange: (v: AddressForm) => void;
  /** Label chips to offer. Defaults to every address type. */
  types?: readonly { label: string; icon: string }[];
  /** Labels already used elsewhere; shown but not selectable. */
  disabledTypes?: readonly string[];
}) {
  const set = (k: keyof AddressForm) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="mb-1.5 block text-xs font-semibold text-text-body">Type</span>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => {
            const taken = disabledTypes.includes(t.label) && value.label !== t.label;
            return (
              <SelectableChip
                key={t.label}
                label={t.label}
                icon={t.icon}
                selected={value.label === t.label}
                onClick={taken ? undefined : () => set("label")(t.label)}
                className={taken ? "cursor-not-allowed opacity-40" : undefined}
                trailing={taken ? <span className="text-[10px] font-medium">· used</span> : undefined}
              />
            );
          })}
        </div>
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
      {value.length > 0 && (
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Icon name="shield-warning-outline" size={15} />
          We&apos;ll flag dishes with {value.length === 1 ? value[0] : `these ${value.length} allergens`}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {allergenOptions.map((name) => {
          const on = value.includes(name);
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(name)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border py-1 ps-1 pe-3 text-sm font-semibold transition",
                on
                  ? "border-primary bg-primary-bg text-primary"
                  : "border-border bg-card text-text hover:border-primary/40",
              )}
            >
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                <SafeImage src={allergenImages[name]} alt="" fill sizes="28px" className="object-cover" />
                {on && (
                  <span className="absolute inset-0 grid place-items-center bg-primary/80 text-white">
                    <Icon name="check-read-outline" size={16} />
                  </span>
                )}
              </span>
              {name}
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
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-text-muted bg-card px-3.5 py-2 text-sm font-bold text-text shadow-card transition hover:border-primary hover:text-primary"
        >
          <Icon name="add-circle-outline" size={17} className="text-primary" />
          Add another
        </button>
      )}
    </div>
  );
}
