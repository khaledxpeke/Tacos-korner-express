import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Site content width: 20px gutters on phones, centered 1200px column on desktop. */
export function Container({
  children,
  className,
  size = "lg",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        size === "lg" && "max-w-[1280px]",
        size === "md" && "max-w-[860px]",
        size === "sm" && "max-w-[520px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
