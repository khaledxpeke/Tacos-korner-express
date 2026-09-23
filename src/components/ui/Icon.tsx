"use client";

import { Icon as IconifyIcon, addCollection } from "@iconify/react";
import type { IconifyJSON } from "@iconify/types";
import solar from "@/lib/solar-icons.json";
import { cn } from "@/lib/utils";

let registered = false;
if (!registered) {
  addCollection(solar as IconifyJSON);
  registered = true;
}

export interface IconProps {
  /** Solar icon name without the prefix, e.g. `home-2-bold` */
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** Solar icon. Outline for idle, bold when active, same as the Flutter `solar_icons` package. */
export function Icon({ name, size = 20, className, style }: IconProps) {
  return (
    <IconifyIcon
      icon={`solar:${name}`}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      style={style}
      aria-hidden
    />
  );
}
