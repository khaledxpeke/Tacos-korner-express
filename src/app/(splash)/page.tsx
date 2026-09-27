"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { ONBOARDING_KEY, OnboardingIntro } from "@/components/auth/OnboardingIntro";
import { AddressLookup } from "@/components/layout/FulfillmentBar";
import { useFulfillment } from "@/context/FulfillmentContext";
import { useSession } from "@/context/SessionContext";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn } from "@/lib/utils";

/**
 * First visit, or "Continue as guest" after logging out: delivery / pickup and an address, or sign-in.
 * No kitchens until we know where they are. Phones see the intro slides once before this.
 */
export default function WelcomePage() {
  const router = useRouter();
  const { ready, needsAddress } = useFulfillment();
  const session = useSession();
  const show = needsAddress || session.status === "signedOut";
  const [introSeen, setIntroSeen, introReady] = useLocalStorage<boolean>(ONBOARDING_KEY, false);

  useEffect(() => {
    if (ready && session.ready && !show) router.replace("/home");
  }, [ready, session.ready, show, router]);

  if (!ready || !session.ready || !introReady || !show) {
    return (
      <main className="grid flex-1 place-items-center bg-bg">
        <p className="text-sm font-semibold text-text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <>
      {!introSeen && <OnboardingIntro onDone={() => setIntroSeen(true)} />}
      {/* While the phone intro is up, the form is desktop-only. */}
      <div className={cn("flex flex-1 md:grid md:min-h-dvh md:grid-cols-2", !introSeen && "hidden")}>
        <AuthBrandPanel />
        <div className="flex flex-1 flex-col bg-bg md:justify-center md:overflow-y-auto md:px-12 md:py-10">
          <div className="flex w-full flex-1 flex-col px-6 py-8 md:mx-auto md:max-w-[420px] md:flex-none md:px-0">
            <AddressLookup
              framed
              onSaved={() => {
                if (!session.isMember) session.continueAsGuest();
                router.replace("/home");
              }}
            />
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-center text-sm text-text-body">
                Already have an account? Your saved address comes with it.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/login"
                  className="flex h-11 flex-1 items-center justify-center rounded-[12px] bg-primary text-sm font-bold text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="flex h-11 flex-1 items-center justify-center rounded-[12px] border border-border bg-card text-sm font-bold text-text"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
