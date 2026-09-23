"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordStrengthBar, passwordStrength } from "@/components/auth/AuthWidgets";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";

/** Mirrors `change_password_screen.dart`. */
export default function ChangePasswordPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ cur?: string; pw?: string; confirm?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (cur.length < 6) err.cur = "Enter your current password";
    if (passwordStrength(pw) < 2) err.pw = "Use 8+ chars with a number or capital";
    if (pw !== confirm) err.confirm = "Passwords do not match";
    setErrors(err);
    if (Object.keys(err).length) return;
    snack.show("Password changed", "success");
    router.push("/settings");
  }

  return (
    <>
      <BackAppBar title="Change Password" fallbackHref="/settings" />
      <Page>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,560px)_1fr]">
        <Card className="p-5 md:p-8">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <TextField
              label="Current password"
              type="password"
              icon="lock-password-outline"
              value={cur}
              onChange={(e) => setCur(e.target.value)}
              error={errors.cur}
              autoComplete="current-password"
            />
            <div>
              <TextField
                label="New password"
                type="password"
                icon="lock-password-outline"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                error={errors.pw}
                autoComplete="new-password"
              />
              <PasswordStrengthBar password={pw} />
            </div>
            <TextField
              label="Confirm new password"
              type="password"
              icon="lock-password-outline"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
              autoComplete="new-password"
            />
            <ul className="rounded-[12px] bg-card-gray p-3 text-xs text-text-body">
              {[
                ["8+ characters", pw.length >= 8],
                ["One uppercase letter", /[A-Z]/.test(pw)],
                ["One number", /[0-9]/.test(pw)],
              ].map(([label, ok]) => (
                <li key={String(label)} className="flex items-center gap-2 py-0.5">
                  <Icon
                    name={ok ? "check-circle-bold" : "close-circle-outline"}
                    size={14}
                    className={ok ? "text-green" : "text-text-muted"}
                  />
                  {label as string}
                </li>
              ))}
            </ul>
            <Button title="Update password" type="submit" icon="shield-check-outline" className="mt-2" />
          </form>
        </Card>
        <aside className="hidden rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card lg:block">
          <h2 className="text-lg font-extrabold text-text">Keep your account safe</h2>
          <p className="mt-2 text-sm text-text-body">
            Use a password you don&apos;t reuse on other sites. This screen only updates the demo
            account — nothing is sent to a server yet.
          </p>
        </aside>
        </div>
      </Page>
    </>
  );
}
