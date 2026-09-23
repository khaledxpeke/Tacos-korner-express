"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isLoading?: boolean;
  isTransparent?: boolean;
  isDisabled?: boolean;
  icon?: string;
  iconRight?: boolean;
  bgClass?: string;
  size?: "md" | "sm";
}

/** Primary full-width button. Mirrors `button_widget.dart` (gradient red, 12px radius). */
export function Button({
  title,
  isLoading,
  isTransparent,
  isDisabled,
  icon,
  iconRight,
  bgClass,
  size = "md",
  className,
  ...rest
}: Props) {
  const disabled = isDisabled || isLoading;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-[12px] font-bold transition active:scale-[0.98]",
        size === "md" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs",
        isTransparent
          ? "border-[1.5px] border-primary bg-transparent text-primary"
          : bgClass
            ? cn(bgClass, "text-white shadow-card")
            : "bg-gradient-to-r from-primary to-primary-dark text-white shadow-card",
        isDisabled && "opacity-50",
        isLoading && "bg-none bg-text-muted/50",
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <Dots />
      ) : (
        <>
          {icon && !iconRight && <Icon name={icon} size={18} />}
          <span className="truncate">{title}</span>
          {icon && iconRight && <Icon name={icon} size={18} />}
        </>
      )}
    </button>
  );
}

function Dots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-white pulse-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

/** Outline / gold secondary action. Mirrors `secondary_button.dart`. */
export function SecondaryButton({
  title,
  icon,
  gold,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  icon?: string;
  gold?: boolean;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center gap-2 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98]",
        gold
          ? "border-secondary bg-secondary/10 text-secondary"
          : "border-border bg-card text-text",
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {title}
      {children}
    </button>
  );
}

/** Round icon button used on cards (heart, close). Mirrors `button_icon_widget.dart`. */
export function IconButton({
  icon,
  size = 28,
  iconSize = 16,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <button
      type="button"
      className={cn(
        "grid place-items-center rounded-full bg-card/90 shadow-card backdrop-blur",
        className,
      )}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
