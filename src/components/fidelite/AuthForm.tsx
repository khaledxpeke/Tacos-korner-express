"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/fidelite/Shell";
import { CountrySelect } from "@/components/fidelite/CountrySelect";
import { LockIcon, MailIcon, PhoneIcon, PrimaryButton, TextField, UserIcon } from "@/components/fidelite/Fields";
import { loyaltyApi, loyaltyRoutes, saveToken, type LoyaltyAccount } from "@/lib/loyalty";
import { isLoyaltyPasswordStrong, loyaltyPasswordRules } from "@/lib/loyaltyPassword";
import { nationalDigits, PHONE_COUNTRIES, phoneLengthLabel, phoneTooLongMessage } from "@/lib/phoneCountries";

type Mode = "login" | "signup";

function emailMessage(value: string, revealIncomplete: boolean) {
  const email = value.trim();
  if (!email) return revealIncomplete ? "L'e-mail est requis." : "";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  const domain = email.split("@")[1] ?? "";
  if (!email.includes("@") || revealIncomplete || domain.includes(".") || /\s/.test(email)) {
    return "Adresse e-mail invalide.";
  }
  return "";
}

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
  const [loginWith, setLoginWith] = useState<"email" | "phone">("email");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, password: false });

  const selected = PHONE_COUNTRIES.find((item) => item.iso === country) ?? PHONE_COUNTRIES[0];
  const reveal = {
    name: touched.name || submitted,
    email: touched.email || submitted,
    phone: touched.phone || submitted,
    password: touched.password || submitted,
  };
  const digits = nationalDigits(phone);
  const nameError =
    mode === "signup" && reveal.name
      ? fullName.trim().length >= 2
        ? ""
        : fullName.trim()
          ? "2 caractères minimum."
          : "Le nom est requis."
      : "";
  const showEmail = mode === "signup" || loginWith === "email";
  const showPhone = mode === "signup" || loginWith === "phone";
  const emailError = showEmail ? emailMessage(email, reveal.email) : "";
  const phoneError =
    phoneTooLongMessage(phone, selected) ||
    (reveal.phone && (digits.length < selected.min || digits.length > selected.max)
      ? digits
        ? `${phoneLengthLabel(selected)} requis.`
        : "Le numéro est requis."
      : "");
  const missingPasswordRule = loyaltyPasswordRules.find((rule) => !rule.test(password));
  const passwordError =
    mode === "signup"
      ? password
        ? (missingPasswordRule?.message ?? "")
        : reveal.password
          ? "Le mot de passe est requis."
          : ""
      : reveal.password && !password
        ? "Le mot de passe est requis."
        : "";

  function markTouched(field: keyof typeof touched) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError("");
    const signupInvalid =
      fullName.trim().length < 2 ||
      Boolean(emailMessage(email, true)) ||
      digits.length < selected.min ||
      digits.length > selected.max ||
      !isLoyaltyPasswordStrong(password);
    const loginInvalid =
      loginWith === "phone"
        ? digits.length < selected.min || digits.length > selected.max || !password
        : Boolean(emailMessage(email, true)) || !password;
    if (mode === "signup" ? signupInvalid : loginInvalid) return;
    setBusy(true);
    try {
      const body =
        mode === "signup"
          ? { fullName, email, country, phone, password }
          : loginWith === "phone"
            ? { phone, country, password }
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
            ? loginWith === "phone"
              ? "Connectez-vous avec votre numéro."
              : "Connectez-vous avec votre e-mail."
            : "E-mail, mot de passe, et le numéro utilisé sur la borne."
        }
      />
      <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 px-7 py-7 md:px-0">
        {mode === "signup" && (
          <TextField
            label="Nom"
            icon={<UserIcon />}
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setError("");
            }}
            onBlur={() => markTouched("name")}
            error={nameError}
            autoComplete="name"
            placeholder="Votre nom"
            required
          />
        )}
        {showEmail && (
        <TextField
          label="E-mail"
          type="email"
          icon={<MailIcon />}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          onBlur={() => markTouched("email")}
          error={emailError}
          autoComplete="email"
          placeholder="vous@email.com"
          required
        />
        )}
        {showPhone && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-text-body">Téléphone</span>
            <span className="flex gap-2">
              <CountrySelect value={country} onChange={setCountry} />
              <span className="relative block min-w-0 flex-1">
                <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  <PhoneIcon />
                </span>
                <input
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  onBlur={() => markTouched("phone")}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={phoneLengthLabel(selected)}
                  aria-label="Numéro de téléphone"
                  aria-invalid={phoneError ? true : undefined}
                  required
                  className={`w-full rounded-[12px] border bg-card py-3 ps-11 pe-4 text-sm text-text placeholder:text-text-muted outline-none transition focus:ring-2 ${
                    phoneError
                      ? "border-danger focus:border-danger focus:ring-danger/25"
                      : "border-border focus:border-amber focus:ring-amber/25"
                  }`}
                />
              </span>
            </span>
            <span className={`mt-1.5 block text-xs ${phoneError ? "text-danger" : "text-text-muted"}`}>
              {phoneError || `+${selected.dial} · ${phoneLengthLabel(selected)}`}
            </span>
          </label>
        )}
        <TextField
          label="Mot de passe"
          type="password"
          icon={<LockIcon />}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          onBlur={() => markTouched("password")}
          error={passwordError}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={mode === "signup" ? "8 caractères minimum" : "Votre mot de passe"}
          required
        />
        {mode === "signup" && (
          <ul className="-mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
            {loyaltyPasswordRules.map((rule) => {
              const ok = rule.test(password);
              const failed = Boolean(password) && !ok;
              return (
                <li
                  key={rule.label}
                  className={`text-xs ${ok ? "font-semibold text-green" : failed ? "text-danger" : "text-text-muted"}`}
                >
                  {ok ? "✓" : "•"} {rule.label}
                </li>
              );
            })}
          </ul>
        )}
        {error && (
          <p className="rounded-[12px] bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
        )}
        {mode === "login" && (
          <button
            type="button"
            onClick={() => {
              setLoginWith((current) => (current === "email" ? "phone" : "email"));
              setSubmitted(false);
              setError("");
            }}
            className="self-center text-sm font-semibold text-text-body"
          >
            {loginWith === "email" ? "Se connecter avec le numéro" : "Se connecter avec l'e-mail"}
          </button>
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
