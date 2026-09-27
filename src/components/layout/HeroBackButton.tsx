"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Round back button over a hero photo on phones, for screens outside the tab bar that have no app bar. */
export function HeroBackButton({ fallbackHref = "/home", className }: { fallbackHref?: string; className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallbackHref))}
      className={cn(
        "absolute start-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur md:hidden",
        className,
      )}
    >
      <Icon name="alt-arrow-left-outline" size={22} className="rtl:rotate-180" />
    </button>
  );
}
