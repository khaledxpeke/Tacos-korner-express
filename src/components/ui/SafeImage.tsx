"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image with an error fallback so a broken remote URL never shows alt text over the card.
 * Mirrors the placeholder behavior of `custom_cashed_image.dart`.
 */
export function SafeImage({ className, alt, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-label={typeof alt === "string" ? alt : undefined}
        className={cn(
          "absolute inset-0 grid place-items-center bg-gradient-to-br from-card-gray to-border text-2xl",
          className,
        )}
      >
        🍽️
      </span>
    );
  }
  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
