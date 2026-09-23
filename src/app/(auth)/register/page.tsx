"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthHeader, PasswordStrengthBar, SocialButton, passwordStrength } from "@/components/auth/AuthWidgets";
import { Button } from "@/components/ui/Button";
import { Checkbox, PhoneField, TextField } from "@/components/ui/Fields";
import { useSnackbar } from "@/context/SnackbarContext";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors `register_screen.dart`: account form, then the details flow. */
export default function RegisterPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof f | "terms", string>>>({});

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (f.first.trim().length < 2) err.first = "Required";
    if (f.last.trim().length < 2) err.last = "Required";
    if (!emailRe.test(f.email)) err.email = "Enter a valid email";
    if (f.phone.replace(/\D/g, "").length < 8) err.phone = "Enter a valid number";
    if (passwordStrength(f.password) < 2) err.password = "Use 8+ chars with a number or capital";
    if (f.confirm !== f.password) err.confirm = "Passwords do not match";
    if (!terms) err.terms = "Please accept the terms";
    setErrors(err);
    if (Object.keys(err).length) {
      if (err.terms) snack.show(err.terms, "warning");
      return;
    }
    window.sessionStorage.setItem("tk_register", JSON.stringify({ first: f.first, last: f.last }));
    router.push("/register/details");
  }

  return (
    <div className="flex flex-1 flex-col">
      <AuthHeader
        title="Create account"
        subtitle="A few details and you're ready to order."
        gradient="from-secondary to-secondary-dark"
        showBack
        onBack={() => router.push("/login")}
      />
      <form onSubmit={submit} className="flex flex-1 flex-col gap-4 px-7 py-7">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="First name" placeholder="Khaled" value={f.first} onChange={set("first")} error={errors.first} autoComplete="given-name" />
          <TextField label="Last name" placeholder="Bouajila" value={f.last} onChange={set("last")} error={errors.last} autoComplete="family-name" />
        </div>
        <TextField
          label="Email"
          type="email"
          icon="letter-outline"
          placeholder="you@example.com"
          value={f.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
        <PhoneField placeholder="55 123 456" value={f.phone} onChange={set("phone")} error={errors.phone} />
        <div>
          <TextField
            label="Password"
            type="password"
            icon="lock-password-outline"
            placeholder="Create a password"
            value={f.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete="new-password"
          />
          <PasswordStrengthBar password={f.password} />
        </div>
        <TextField
          label="Confirm password"
          type="password"
          icon="lock-password-outline"
          placeholder="Repeat your password"
          value={f.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <Checkbox checked={terms} onChange={setTerms}>
          I agree to the{" "}
          <Link href="/terms" className="font-semibold text-primary">Terms</Link> and{" "}
          <Link href="/privacy" className="font-semibold text-primary">Privacy Policy</Link>
        </Checkbox>
        <Button title="Continue" type="submit" icon="alt-arrow-right-outline" iconRight className="mt-2" />

        <div className="my-2 flex items-center gap-3 text-[11px] font-semibold text-text-muted">
          <span className="h-px flex-1 bg-border" />
          OR SIGN UP WITH
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <SocialButton provider="google" onClick={() => snack.show("Social sign-up is UI only", "info")} />
          <SocialButton provider="facebook" onClick={() => snack.show("Social sign-up is UI only", "info")} />
          <SocialButton provider="apple" onClick={() => snack.show("Social sign-up is UI only", "info")} />
        </div>
        <p className="mt-2 text-center text-sm text-text-body">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
