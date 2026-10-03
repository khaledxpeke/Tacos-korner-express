"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/fidelite/Shell";
import { LockIcon, MailIcon, PhoneIcon, PrimaryButton, TextField, UserIcon } from "@/components/fidelite/Fields";
import { loyaltyApi, loyaltyRoutes, saveToken, type LoyaltyAccount } from "@/lib/loyalty";
import { PHONE_COUNTRIES, phoneLengthLabel } from "@/lib/phoneCountries";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const session = search.get("session") || "";
  const next = session ? loyaltyRoutes.link(session) : loyaltyRoutes.points;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("TN");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = PHONE_COUNTRIES.find((item) => item.iso === country) ?? PHONE_COUNTRIES[0];

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    if (mode === "signup") {
      const digits = phone.replace(/\D/g, "").replace(/^0/, "");
      if (digits.length < selected.min || digits.length > selected.max) {
        setError(`Le numéro ${selected.name} doit contenir ${phoneLengthLabel(selected)}.`);
        setBusy(false);
        return;
      }
    }
    try {
      const body =
        mode === "signup"
          ? { fullName, email, country, phone, password }
          : { email, password };
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
            ? "Connectez-vous avec votre e-mail."
            : "E-mail, mot de passe, et le numéro utilisé sur la borne."
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
          label="E-mail"
          type="email"
          icon={<MailIcon />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="vous@email.com"
          required
        />
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-text-body">Téléphone</span>
            <span className="flex gap-2">
              <span className="relative block w-[42%] shrink-0">
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  aria-label="Indicatif"
                  className="w-full appearance-none rounded-[12px] border border-border bg-card px-3 py-3 text-sm text-text outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/25"
                >
                  {PHONE_COUNTRIES.map((item) => (
                    <option key={item.iso} value={item.iso}>
                      {item.name} +{item.dial}
                    </option>
                  ))}
                </select>
              </span>
              <span className="relative block min-w-0 flex-1">
                <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  <PhoneIcon />
                </span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={phoneLengthLabel(selected)}
                  aria-label="Numéro de téléphone"
                  required
                  className="w-full rounded-[12px] border border-border bg-card py-3 ps-11 pe-4 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/25"
                />
              </span>
            </span>
            <span className="mt-1.5 block text-xs text-text-muted">
              +{selected.dial} · {phoneLengthLabel(selected)}
            </span>
          </label>
        )}
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
