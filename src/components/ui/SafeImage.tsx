"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * next/image with an error fallback so a broken remote URL never shows alt text over the card.
 * Mirrors the placeholder behavior of `custom_cashed_image.dart`.
 */
export function SafeImage({ className, alt, priority, loading, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const eager = Boolean(priority) || loading === "eager";
  if (failed) {
    return (
      <span
        aria-label={typeof alt === "string" ? alt : undefined}
        className={cn(
          "absolute inset-0 grid place-items-center bg-gradient-to-br from-card-gray to-border text-2xl",
          className,
        )}
      >
        <Icon name="chef-hat-bold" size={28} className="text-text-muted" />
      </span>
    );
  }
  return (
    <Image
      alt={alt}
      className={className}
      loading={eager ? "eager" : loading}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
