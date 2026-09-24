"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useFulfillment } from "@/context/FulfillmentContext";

/** App pages wait for an address. First visit goes back to the welcome screen. */
export function RequireLocation({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, needsAddress } = useFulfillment();

  useEffect(() => {
    if (ready && needsAddress) router.replace("/");
  }, [ready, needsAddress, router]);

  if (!ready) {
    return (
      <div className="grid flex-1 place-items-center">
        <p className="text-sm font-semibold text-text-muted">Loading…</p>
      </div>
    );
  }

  if (needsAddress) return null;
  return children;
}
