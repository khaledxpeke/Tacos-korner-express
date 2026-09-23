"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  subtitle?: string;
  trailing?: ReactNode;
  /** Overlay on top of a hero image (phones only). */
  transparent?: boolean;
  /** Where to go if there is no history (direct load). */
  fallbackHref?: string;
  /** Hide the whole bar on desktop (used when the page renders its own heading). */
  mobileOnly?: boolean;
  className?: string;
}

/**
 * Phones: sticky app bar with a back button (mirrors `custom_back_appbar.dart`).
 * Desktop: an inline title row inside the content column.
 */
export function BackAppBar({
  title,
  subtitle,
  trailing,
  transparent,
  fallbackHref = "/home",
  mobileOnly,
  className,
}: Props) {
  const router = useRouter();

  function back() {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push(fallbackHref);
  }

  return (
    <header
      className={cn(
        "z-20",
        transparent
          ? "absolute inset-x-0 top-0 md:static md:mt-6"
          : "sticky top-0 bg-card md:static md:bg-transparent md:pt-6",
        mobileOnly && "md:hidden",
        className,
      )}
    >
      <Container className="flex h-[60px] items-center gap-3 md:h-auto">
        <button
          type="button"
          onClick={back}
          aria-label="Back"
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full",
            transparent
              ? "bg-black/35 text-white backdrop-blur md:bg-card md:text-text md:shadow-card"
              : "bg-card-gray text-text md:bg-card md:shadow-card",
          )}
        >
          <Icon name="alt-arrow-left-outline" size={22} className="rtl:rotate-180" />
        </button>
        <div className="min-w-0 flex-1">
          {title && (
            <h1
              className={cn(
                "truncate text-base font-bold md:text-2xl md:font-extrabold",
                transparent ? "text-white md:text-text" : "text-text",
              )}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="truncate text-xs text-text-muted md:text-sm">{subtitle}</p>
          )}
        </div>
        {trailing}
      </Container>
    </header>
  );
}
