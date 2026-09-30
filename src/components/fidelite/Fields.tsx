"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

const fieldBase =
  "w-full rounded-[12px] border bg-card px-4 py-3 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/25";

export function TextField({
  label,
  icon,
  error,
  type,
  id,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  error?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-xs font-semibold text-text-body">{label}</span>
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={isPassword && show ? "text" : type}
          className={`${fieldBase} ${icon ? "ps-11" : ""} ${isPassword ? "pe-11" : ""} ${
            error ? "border-danger" : "border-border"
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setShow((value) => !value)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted"
          >
            <EyeIcon open={show} />
          </button>
        )}
      </span>
    </label>
  );
}

export function PrimaryButton({
  title,
  loading,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { title: string; loading?: boolean }) {
  return (
    <button
      {...rest}
      type="submit"
      disabled={loading || rest.disabled}
      className="mt-2 flex w-full items-center justify-center rounded-[12px] bg-linear-to-r from-primary to-primary-dark px-6 py-3 text-sm font-bold text-white shadow-card transition hover:brightness-95 active:scale-[0.98] disabled:bg-none disabled:bg-text-muted/40"
    >
      {loading ? <Dots /> : title}
    </button>
  );
}

export function OutlineButton({
  title,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { title: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center rounded-[12px] border-[1.5px] border-primary bg-transparent px-6 py-3 text-sm font-bold text-primary transition hover:bg-primary-bg"
      {...rest}
    >
      {title}
    </button>
  );
}

function Dots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="pulse-dot h-2 w-2 rounded-full bg-white"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.2 19.2c1.3-3 3.6-4.4 6.8-4.4s5.5 1.4 6.8 4.4" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="2.8" width="10" height="18.4" rx="2.2" />
      <path d="M11 18.2h2" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12s3.2-6 8-6 8 6 8 6-3.2 6-8 6-8-6-8-6Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12s3.2-6 8-6 8 6 8 6-3.2 6-8 6-8-6-8-6Z" />
      <path d="M5 5l14 14" strokeLinecap="round" />
    </svg>
  );
}
