"use client";

import { useEffect, useState, type ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/fidelite/Shell";
import { OutlineButton } from "@/components/fidelite/Fields";
import {
  clearToken,
  getToken,
  loyaltyApi,
  loyaltyRoutes,
  mediaUrl,
  type LedgerEntry,
  type LedgerPage,
  type LoyaltyAccount,
} from "@/lib/loyalty";

const PAGE_SIZE = 6;

export default function PointsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [listError, setListError] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<LedgerEntry | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace(loyaltyRoutes.login);
      return;
    }
    let cancelled = false;
    loyaltyApi<{ account: LoyaltyAccount }>("/loyalty/me")
      .then((profile) => {
        if (!cancelled) setAccount(profile.account);
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

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    setLoadingList(true);
    loyaltyApi<LedgerPage>(`/loyalty/ledger?page=${page}&limit=${PAGE_SIZE}`)
      .then((ledger) => {
        if (cancelled) return;
        setEntries(ledger.entries);
        setPages(ledger.pages);
        setTotal(ledger.total);
        setListError("");
        if (ledger.page !== page) setPage(ledger.page);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setListError(err instanceof Error ? err.message : "Impossible de charger les mouvements.");
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  function logout() {
    clearToken();
    router.replace(loyaltyRoutes.login);
  }

  if (!account) {
    return <p className="px-7 py-16 text-sm text-text-muted">{error || "Chargement…"}</p>;
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-6 md:px-0 md:py-0">
      <PageHeader title="Mes points" subtitle={`${account.fullName} · ${account.email}`} />

      <section className="overflow-hidden rounded-[20px] bg-card shadow-card">
        <div className="bg-linear-to-br from-primary to-primary-dark px-5 py-5 text-white">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/75">Solde</p>
          <p className="mt-1 text-5xl font-extrabold tracking-tight">{account.balance.toLocaleString("fr-FR")}</p>
          <p className="mt-1 text-sm text-white/80">À utiliser sur la borne</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-secondary-dark uppercase">Code membre</p>
          <p className="mt-1 text-2xl font-extrabold tracking-[0.28em] text-text">{account.code}</p>
        </div>
      </section>

      <section className="rounded-[20px] bg-card shadow-card">
        <div className="flex items-baseline justify-between gap-3 px-5 pt-4 pb-2">
          <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">Mouvements</p>
          <p className="text-xs text-text-muted">{total === 0 ? "Aucun" : total.toLocaleString("fr-FR")}</p>
        </div>

        {listError ? (
          <p className="px-5 py-6 text-sm text-danger">{listError}</p>
        ) : loadingList ? (
          <p className="px-5 py-6 text-sm text-text-muted">Chargement…</p>
        ) : entries.length === 0 ? (
          <p className="px-5 py-6 text-sm text-text-body">Aucun mouvement pour le moment.</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <Movement key={entry.id} entry={entry} onOpen={() => setSelected(entry)} />
            ))}
          </ul>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-3">
            <PagerButton disabled={page <= 1 || loadingList} onClick={() => setPage((value) => value - 1)}>
              Précédent
            </PagerButton>
            <p className="text-xs font-semibold text-text-body">
              {page} / {pages}
            </p>
            <PagerButton disabled={page >= pages || loadingList} onClick={() => setPage((value) => value + 1)}>
              Suivant
            </PagerButton>
          </div>
        )}
      </section>

      <OutlineButton title="Se déconnecter" onClick={logout} />
      {selected && <OrderDialog entry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function whenLabel(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Movement({ entry, onOpen }: { entry: LedgerEntry; onOpen: () => void }) {
  const earned = entry.type === "earn";
  const order = entry.order;
  const title = order?.restaurantName || (earned ? "Commande" : "Cashback");
  const command =
    order?.commandNumber != null ? `Commande n°${order.commandNumber}` : earned ? "Commande" : "Cashback";

  return (
    <li className="border-t border-border">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-primary-bg/60"
      >
        <RestaurantMark name={title} logo={order?.logo} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{title}</span>
          <span className="block truncate text-xs text-text-muted">
            {command}
            {order?.pack ? ` · ${order.pack}` : ""} · {whenLabel(entry.createdAt)}
          </span>
        </span>
        <span className="text-end">
          <span className={`block text-sm font-extrabold ${earned ? "text-green" : "text-primary"}`}>
            {entry.points > 0 ? `+${entry.points}` : entry.points}
          </span>
          <span className="block text-[11px] text-text-muted">{earned ? "gagnés" : "utilisés"}</span>
        </span>
      </button>
    </li>
  );
}

function RestaurantMark({ name, logo }: { name: string; logo?: string }) {
  const [failed, setFailed] = useState(false);
  const src = !failed ? mediaUrl(logo) : "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (!src) {
    return (
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-bg text-xs font-extrabold text-primary">
        {initials || "TK"}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="h-11 w-11 shrink-0 rounded-2xl object-cover"
    />
  );
}

function OrderDialog({ entry, onClose }: { entry: LedgerEntry; onClose: () => void }) {
  const order = entry.order;
  const earned = entry.type === "earn";
  const title = order?.restaurantName || "Commande";

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-card shadow-card"
      >
        <div className="flex items-center gap-3 bg-linear-to-br from-primary to-primary-dark px-5 py-5 text-white">
          <RestaurantMark name={title} logo={order?.logo} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold">{title}</p>
            <p className="text-sm text-white/80">
              {order?.commandNumber != null ? `Commande n°${order.commandNumber}` : "Commande"}
              {order?.pack ? ` · ${order.pack}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-lg"
          >
            ×
          </button>
        </div>
        <div className="space-y-4 px-5 py-4">
          <p className="text-xs text-text-muted">
            {whenLabel(entry.createdAt)}
            {order?.method ? ` · ${order.method}` : ""}
          </p>
          {order?.items?.length ? (
            <ul className="space-y-3">
              {order.items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <p className="text-sm font-semibold">
                    {item.count}× {item.name}
                  </p>
                  {item.details && <p className="text-xs text-text-body">{item.details}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-body">Le détail de cette commande n’est plus disponible.</p>
          )}
          {order?.note && (
            <p className="rounded-2xl bg-primary-bg px-3 py-2 text-sm text-text">
              <span className="font-semibold">Note : </span>
              {order.note}
            </p>
          )}
          <div className="flex items-end justify-between border-t border-border pt-3">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                {earned ? "Points gagnés" : "Points utilisés"}
              </p>
              <p className={`text-xl font-extrabold ${earned ? "text-green" : "text-primary"}`}>
                {entry.points > 0 ? `+${entry.points}` : entry.points}
              </p>
            </div>
            {order?.total != null && (
              <p className="text-sm font-bold">
                {Number(order.total).toFixed(2)} {order.currency}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PagerButton({
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="rounded-[10px] px-3 py-2 text-sm font-semibold text-text transition hover:bg-primary-bg disabled:pointer-events-none disabled:text-text-muted"
      {...rest}
    >
      {children}
    </button>
  );
}
