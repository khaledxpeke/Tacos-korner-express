"use client";

import { SafeImage as Image } from "@/components/ui/SafeImage";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

/** Mirrors `custom_shimmer.dart`. */
export function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={cn("shimmer rounded-[12px]", className)} style={style} />;
}

/** Mirrors `empty_card.dart`. */
export function EmptyCard({
  icon = "box-outline",
  title,
  message,
  action,
  className,
}: {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border border-border bg-card px-6 py-10 text-center shadow-card",
        className,
      )}
    >
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary-bg text-primary">
        <Icon name={icon} size={32} />
      </div>
      <h3 className="text-base font-bold text-text">{title}</h3>
      {message && <p className="mt-1 text-sm text-text-muted">{message}</p>}
      {action && <div className="mt-5 w-full">{action}</div>}
    </div>
  );
}

/** Mirrors `custom_cashed_image.dart`: rounded remote image with cover fit. */
export function CachedImage({
  src,
  alt = "",
  className,
  radius = 12,
  priority,
  sizes = "(max-width: 640px) 100vw, 600px",
}: {
  src: string;
  alt?: string;
  className?: string;
  radius?: number;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <span
      className={cn("relative block overflow-hidden bg-card-gray", className)}
      style={{ borderRadius: radius }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        className="object-cover"
      />
    </span>
  );
}

/** Mirrors `selectable_chip.dart`. */
export function SelectableChip({
  label,
  selected,
  onClick,
  trailing,
  icon,
  className,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
  icon?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
        selected
          ? "border-primary bg-primary text-white"
          : "border-border bg-card text-text-body",
        className,
      )}
    >
      {icon && <Icon name={icon} size={14} />}
      {label}
      {trailing}
    </button>
  );
}

/** Mirrors `qty_stepper.dart`. */
export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card p-0.5",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          btn,
          "grid place-items-center rounded-full text-primary disabled:text-text-muted-light",
        )}
      >
        <Icon name="minus-circle-bold" size={size === "sm" ? 20 : 24} />
      </button>
      <span
        className={cn(
          "min-w-5 text-center font-bold text-text",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          btn,
          "grid place-items-center rounded-full text-primary disabled:text-text-muted-light",
        )}
      >
        <Icon name="add-circle-bold" size={size === "sm" ? 20 : 24} />
      </button>
    </div>
  );
}

export function Stars({
  rating,
  size = 12,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="star-bold"
          size={size}
          className={i <= Math.round(rating) ? "text-amber" : "text-text-muted-light"}
        />
      ))}
    </span>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
  className,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-base font-bold text-text">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-0.5 text-xs font-semibold text-primary"
        >
          {action}
          <Icon name="alt-arrow-right-outline" size={14} className="rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: ReactNode;
  tone?: "primary" | "green" | "amber" | "blue" | "purple" | "muted" | "danger";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary-bg text-primary",
    green: "bg-green-bg text-green",
    amber: "bg-amber-bg text-amber",
    blue: "bg-blue-bg text-blue",
    purple: "bg-purple-bg text-purple",
    muted: "bg-card-gray text-text-muted",
    danger: "bg-danger-bg text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "block w-full rounded-card border-[0.5px] border-border bg-card text-start shadow-card",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function ListTile({
  icon,
  iconTone = "primary",
  title,
  subtitle,
  trailing,
  onClick,
  href,
  className,
}: {
  icon: string;
  iconTone?: "primary" | "green" | "amber" | "blue" | "purple" | "muted" | "danger";
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const tones = {
    primary: "bg-primary-bg text-primary",
    green: "bg-green-bg text-green",
    amber: "bg-amber-bg text-amber",
    blue: "bg-blue-bg text-blue",
    purple: "bg-purple-bg text-purple",
    muted: "bg-card-gray text-text-muted",
    danger: "bg-danger-bg text-danger",
  };
  const label = (
    <>
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-[12px]", tones[iconTone])}>
        <Icon name={icon} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-text md:text-base">{title}</span>
        {subtitle && (
          <span className="block truncate text-xs text-text-muted md:text-sm">{subtitle}</span>
        )}
      </span>
    </>
  );
  const arrow = (
    <Icon name="alt-arrow-right-outline" size={18} className="text-text-muted rtl:rotate-180" />
  );
  const cls = cn("flex w-full items-center gap-3 px-4 py-3 text-start md:px-5 md:py-4", className);

  // Custom trailing (switch, etc.) sits outside the row control so we never nest <button>.
  if (trailing) {
    return (
      <div className={cls}>
        {href ? (
          <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
            {label}
          </Link>
        ) : onClick ? (
          <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-start">
            {label}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">{label}</div>
        )}
        {trailing}
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
        {arrow}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
      {arrow}
    </button>
  );
}
