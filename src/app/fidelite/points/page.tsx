"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/fidelite/Shell";
import { OutlineButton } from "@/components/fidelite/Fields";
import {
  clearToken,
  getToken,
  loyaltyApi,
  loyaltyRoutes,
  type LedgerEntry,
  type LoyaltyAccount,
} from "@/lib/loyalty";

export default function PointsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace(loyaltyRoutes.login);
      return;
    }
    let cancelled = false;
    Promise.all([
      loyaltyApi<{ account: LoyaltyAccount }>("/loyalty/me"),
      loyaltyApi<{ entries: LedgerEntry[] }>("/loyalty/ledger"),
    ])
      .then(([profile, ledger]) => {
        if (cancelled) return;
        setAccount(profile.account);
        setEntries(ledger.entries);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        clearToken();
        setError(err instanceof Error ? err.message : "Connexion impossible.");
        router.replace(loyaltyRoutes.login);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function logout() {
    clearToken();
    router.replace(loyaltyRoutes.login);
  }

  if (!account) {
    return <p className="px-7 py-16 text-sm text-text-muted">{error || "Chargement…"}</p>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Mes points" subtitle={`${account.fullName} · ${account.email}`} />
      <div className="flex flex-1 flex-col gap-4 px-7 py-7 md:px-0">
        <section className="rounded-[16px] bg-card p-5 shadow-card">
          <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">Solde</p>
          <p className="mt-1 text-5xl font-extrabold text-primary">{account.balance}</p>
          <p className="mt-1 text-sm text-text-body">À utiliser sur la borne</p>
          <div className="mt-5 rounded-[16px] bg-primary-bg px-4 py-4 text-center">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-secondary-dark uppercase">
              Code membre
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-[0.28em] text-text">{account.code}</p>
          </div>
        </section>

        <section className="rounded-[16px] bg-card px-5 py-2 shadow-card">
          <p className="pt-3 text-xs font-semibold tracking-wide text-text-muted uppercase">Mouvements</p>
          {entries.length === 0 && (
            <p className="py-6 text-sm text-text-body">Aucun mouvement pour le moment.</p>
          )}
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 border-t border-border py-3">
              <span>
                <span className="block text-sm font-semibold">
                  {entry.type === "earn" ? "Commande" : "Cashback"}
                </span>
                <span className="text-xs text-text-muted">
                  {entry.createdAt ? new Date(entry.createdAt).toLocaleString("fr-FR") : ""}
                </span>
              </span>
              <span className={`text-sm font-extrabold ${entry.type === "earn" ? "text-green" : "text-primary"}`}>
                {entry.points > 0 ? `+${entry.points}` : entry.points}
              </span>
            </div>
          ))}
        </section>

        <div className="mt-auto">
          <OutlineButton title="Se déconnecter" onClick={logout} />
        </div>
      </div>
    </div>
  );
}
