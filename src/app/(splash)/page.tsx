"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { AddressLookup } from "@/components/layout/FulfillmentBar";
import { useFulfillment } from "@/context/FulfillmentContext";

/** First visit: address or sign-in. No kitchens until we know where they are. */
export default function WelcomePage() {
  const router = useRouter();
  const { ready, needsAddress } = useFulfillment();

  useEffect(() => {
    if (ready && !needsAddress) router.replace("/home");
  }, [ready, needsAddress, router]);

  if (!ready || !needsAddress) {
    return (
      <main className="grid flex-1 place-items-center bg-bg">
        <p className="text-sm font-semibold text-text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <div className="flex flex-1 md:grid md:min-h-dvh md:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex flex-1 flex-col bg-bg md:justify-center md:overflow-y-auto md:px-12 md:py-10">
        <div className="flex w-full flex-1 flex-col px-6 py-8 md:mx-auto md:max-w-[420px] md:flex-none md:px-0">
          <AddressLookup onSaved={() => router.replace("/home")} />
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
  );
}
