"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[12px] border bg-card px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: string;
  trailing?: ReactNode;
}

/** Mirrors `custom_textfield.dart`. Password type gets an eye toggle. */
export function TextField({
  label,
  hint,
  error,
  icon,
  trailing,
  type,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label htmlFor={inputId} className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-text-body">
          {label}
        </span>
      )}
      <span className="relative block">
        {icon && (
          <Icon
            name={icon}
            size={18}
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
        )}
        <input
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          className={cn(
            fieldBase,
            icon && "ps-11",
            (isPassword || trailing) && "pe-11",
            error ? "border-danger" : "border-border",
          )}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            <Icon name={show ? "eye-closed-outline" : "eye-outline"} size={18} />
          </button>
        ) : (
          trailing && (
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted">
              {trailing}
            </span>
          )
        )}
      </span>
      {error ? (
        <span className="mt-1 block text-xs text-danger">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>
      )}
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-text-body">
          {label}
        </span>
      )}
      <textarea
        className={cn(fieldBase, "min-h-20 resize-none border-border")}
        {...rest}
      />
    </label>
  );
}

/** Search bar. Amber focus ring; no native/clear X. */
export function SearchField({
  className,
  onClear: _onClear,
  value,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { onClear?: () => void }) {
  return (
    <div className={cn("relative", className)}>
      <Icon
        name="magnifier-outline"
        size={20}
        className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        inputMode="search"
        value={value}
        className={cn(
          "w-full rounded-full border border-border bg-card py-3 ps-12 pe-4 text-sm text-text shadow-card outline-none transition placeholder:text-text-muted focus:border-amber focus:ring-2 focus:ring-amber/25",
        )}
        {...rest}
      />
    </div>
  );
}

const countries = [
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
];

/** Mirrors `custom_phone_number_field.dart`. */
export function PhoneField({
  label = "Phone number",
  error,
  className,
  ...rest
}: TextFieldProps) {
  const [code, setCode] = useState("+216");
  return (
    <div className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-text-body">
        {label}
      </span>
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={cn(fieldBase, "w-28 border-border px-3")}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          className={cn(fieldBase, error ? "border-danger" : "border-border")}
          {...rest}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </div>
  );
}

/** Mirrors `custom_dropdown_field.dart`. */
export function Dropdown({
  label,
  options,
  placeholder,
  className,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <label className={cn("block", className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-text-body">
          {label}
        </span>
      )}
      <span className="relative block">
        <select
          className={cn(fieldBase, "appearance-none border-border pe-10")}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="alt-arrow-down-outline"
          size={18}
          className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </span>
    </label>
  );
}

/** Mirrors `custom_switch_button.dart`. */
export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-text-muted-light",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all",
          checked ? "start-6" : "start-1",
        )}
      />
    </button>
  );
}

/** Mirrors `custom_checkbox.dart`. */
export function Checkbox({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition",
          checked ? "border-primary bg-primary text-white" : "border-text-muted",
        )}
      >
        {checked && <Icon name="check-read-outline" size={14} />}
      </span>
      {children && <span className="text-xs text-text-body">{children}</span>}
    </label>
  );
}
