"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthHeader, SocialButton } from "@/components/auth/AuthWidgets";
import { Button } from "@/components/ui/Button";
import { Checkbox, TextField } from "@/components/ui/Fields";
import { useSnackbar } from "@/context/SnackbarContext";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors `login_screen.dart`. Client validation only; submit just navigates. */
export default function LoginPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (!emailRe.test(email)) err.email = "Enter a valid email";
    if (password.length < 6) err.password = "At least 6 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    setTimeout(() => {
      window.localStorage.setItem("tk_onboarded", "1");
      snack.show("Welcome back!", "success");
      router.push("/home");
    }, 700);
  }

  return (
    <div className="flex flex-1 flex-col">
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to continue ordering your favourites."
      />
      <form onSubmit={submit} className="flex flex-1 flex-col gap-4 px-7 py-7">
        <TextField
          label="Email"
          type="email"
          icon="letter-outline"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Password"
          type="password"
          icon="lock-password-outline"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <Checkbox checked={remember} onChange={setRemember}>
            Remember me
          </Checkbox>
          <Link href="/forgot-password" className="text-xs font-semibold text-primary">
            Forgot password?
          </Link>
        </div>
        <Button title="Sign In" type="submit" isLoading={loading} className="mt-2" />

        <div className="my-2 flex items-center gap-3 text-[11px] font-semibold text-text-muted">
          <span className="h-px flex-1 bg-border" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <SocialButton provider="google" onClick={() => snack.show("Social login is UI only", "info")} />
          <SocialButton provider="facebook" onClick={() => snack.show("Social login is UI only", "info")} />
          <SocialButton provider="apple" onClick={() => snack.show("Social login is UI only", "info")} />
        </div>

        <span className="flex-1" />
        <p className="text-center text-sm text-text-body">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-primary">
            Sign up
          </Link>
        </p>
        <Link href="/home" className="text-center text-xs font-semibold text-text-muted">
          Continue as guest
        </Link>
      </form>
    </div>
  );
}
