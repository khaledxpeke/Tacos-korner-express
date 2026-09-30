"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/fidelite/Shell";
import { LockIcon, PhoneIcon, PrimaryButton, TextField, UserIcon } from "@/components/fidelite/Fields";
import { loyaltyApi, loyaltyRoutes, saveToken, type LoyaltyAccount } from "@/lib/loyalty";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const session = search.get("session") || "";
  const next = session ? loyaltyRoutes.link(session) : loyaltyRoutes.points;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = mode === "signup" ? { fullName, phone, password } : { phone, password };
      const result = await loyaltyApi<{ token: string; account: LoyaltyAccount }>(
        mode === "signup" ? "/loyalty/signup" : "/loyalty/login",
        { method: "POST", body: JSON.stringify(body) }
      );
      saveToken(result.token);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  const otherHref = session
    ? `${mode === "login" ? loyaltyRoutes.signup : loyaltyRoutes.login}?session=${encodeURIComponent(session)}`
    : mode === "login"
      ? loyaltyRoutes.signup
      : loyaltyRoutes.login;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={mode === "login" ? "Bon retour" : "Créer un compte"}
        subtitle={
          mode === "login"
            ? "Connectez-vous pour voir vos points."
            : "Un numéro de téléphone suffit pour la borne."
        }
      />
      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 px-7 py-7 md:px-0">
        {mode === "signup" && (
          <TextField
            label="Nom"
            icon={<UserIcon />}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            placeholder="Votre nom"
            required
          />
        )}
        <TextField
          label="Téléphone"
          icon={<PhoneIcon />}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="8 chiffres"
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          icon={<LockIcon />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="6 caractères minimum"
          minLength={6}
          required
        />
        {error && (
          <p className="rounded-[12px] bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <PrimaryButton title={mode === "login" ? "Se connecter" : "S'inscrire"} loading={busy} />
        <p className="mt-auto pt-6 text-center text-sm text-text-body">
          {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <Link href={otherHref} className="font-bold text-primary">
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </Link>
        </p>
      </form>
    </div>
  );
}
