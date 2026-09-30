"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/fidelite/Shell";
import { getToken, loyaltyApi, loyaltyRoutes, type LoyaltyAccount } from "@/lib/loyalty";

function LinkClient() {
  const search = useSearchParams();
  const router = useRouter();
  const session = search.get("session") || "";
  const [status, setStatus] = useState<"working" | "done" | "error">("working");
  const [message, setMessage] = useState("Liaison avec la borne…");
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);

  useEffect(() => {
    if (!session) {
      setStatus("error");
      setMessage("QR code incomplet. Scannez à nouveau le code affiché sur la borne.");
      return;
    }
    if (!getToken()) {
      router.replace(`${loyaltyRoutes.login}?session=${encodeURIComponent(session)}`);
      return;
    }
    let cancelled = false;
    loyaltyApi<{ linked: boolean; customer: LoyaltyAccount }>(
      `/loyalty/sessions/${encodeURIComponent(session)}/link`,
      { method: "POST" }
    )
      .then((result) => {
        if (cancelled) return;
        setAccount(result.customer);
        setStatus("done");
        setMessage("Compte relié. Vous pouvez continuer sur la borne.");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Liaison impossible.");
      });
    return () => {
      cancelled = true;
    };
  }, [router, session]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Borne"
        subtitle={status === "done" ? "C’est bon, la borne vous a reconnu." : "On relie ce téléphone à la caisse."}
      />
      <div className="flex flex-1 flex-col px-7 py-7 md:px-0">
        <section className="rounded-[16px] bg-card px-5 py-8 text-center shadow-card">
          <span
            className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl font-bold ${
              status === "done"
                ? "bg-green-bg text-green"
                : status === "error"
                  ? "bg-danger-bg text-danger"
                  : "bg-primary-bg text-primary"
            }`}
          >
            {status === "done" ? "✓" : status === "error" ? "!" : "…"}
          </span>
          <p className="mt-4 text-sm font-semibold text-text">{message}</p>
          {account && (
            <p className="mt-4 text-2xl font-extrabold tracking-[0.28em] text-text">{account.code}</p>
          )}
          {status !== "working" && (
            <Link href={loyaltyRoutes.points} className="mt-6 inline-block text-sm font-bold text-primary">
              Voir mes points
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={<p className="px-7 py-16 text-sm text-text-muted">Chargement…</p>}>
      <LinkClient />
    </Suspense>
  );
}
