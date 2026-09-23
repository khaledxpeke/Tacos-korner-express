import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

/** Page body: app padding on phones, centered site column on desktop. */
export function Page({
  children,
  className,
  size = "lg",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <main className="flex-1">
      <Container size={size} className={cn("py-5 md:py-8", className)}>
        {children}
      </Container>
    </main>
  );
}

/** Sticky CTA footer on phones; on desktop it is rendered inline by the page (pass `desktopInline`). */
export function PageFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 border-t border-border bg-card pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:hidden",
        className,
      )}
    >
      <Container>{children}</Container>
    </div>
  );
}
