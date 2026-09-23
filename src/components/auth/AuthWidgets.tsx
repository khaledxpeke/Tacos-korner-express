"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { Dropdown, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { SelectableChip } from "@/components/ui/Misc";
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
      <TextField
        label="Street address"
        icon="map-point-outline"
        placeholder="12 Rue du Lac"
        value={value.street}
        onChange={(e) => set("street")(e.target.value)}
      />
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

/** Mirrors `allergy_selector.dart`. */
export function AllergySelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {allergenOptions.map((a) => {
        const on = value.includes(a);
        return (
          <SelectableChip
            key={a}
            label={a}
            selected={on}
            icon={on ? "check-circle-bold" : undefined}
            onClick={() => onChange(on ? value.filter((x) => x !== a) : [...value, a])}
          />
        );
      })}
    </div>
  );
}
