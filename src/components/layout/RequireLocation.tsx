"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useFulfillment } from "@/context/FulfillmentContext";
import { useSession } from "@/context/SessionContext";

/** Pages that need an account. Guests keep home, browsing, cart and the settings page itself. */
const memberOnly = ["/profile", "/orders", "/favorites", "/notifications", "/saved-combos", "/checkout", "/settings/"];

export function isMemberOnly(pathname: string) {
  return memberOnly.some((p) => (p.endsWith("/") ? pathname.startsWith(p) : pathname === p || pathname.startsWith(p + "/")));
}

/**
 * App pages wait for an address. First visit, or after logging out, goes back to the welcome screen
 * (delivery / pickup and an address). Guests opening an account page are sent to sign in.
 */
export function RequireLocation({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, needsAddress } = useFulfillment();
  const session = useSession();

  const needsWelcome = needsAddress || session.status === "signedOut";
  const blocked = session.ready && session.isGuest && isMemberOnly(pathname);

  useEffect(() => {
    if (!ready || !session.ready) return;
    if (needsWelcome) router.replace("/");
    else if (blocked) router.replace("/login");
  }, [ready, session.ready, needsWelcome, blocked, router]);

  if (!ready || !session.ready) {
    return (
      <div className="grid flex-1 place-items-center">
        <p className="text-sm font-semibold text-text-muted">Loading…</p>
      </div>
    );
  }

  if (needsWelcome || blocked) return null;
  return children;
}
