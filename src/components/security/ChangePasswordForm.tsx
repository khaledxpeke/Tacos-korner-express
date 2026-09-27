"use client";

import { useState } from "react";
import { PasswordStrengthBar, isPasswordAcceptable } from "@/components/auth/AuthWidgets";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";

/** Mirrors `change_password_screen.dart`. Demo only: nothing is sent to a server yet. */
export function ChangePasswordForm() {
  const snack = useSnackbar();
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ cur?: string; pw?: string; confirm?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (cur.length < 6) err.cur = "Enter your current password";
    if (!isPasswordAcceptable(pw)) err.pw = "Meet the password requirements below";
    if (pw !== confirm) err.confirm = "Passwords do not match";
    setErrors(err);
    if (Object.keys(err).length) return;
    snack.show("Password changed", "success");
    setCur("");
    setPw("");
    setConfirm("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-2xl border border-blue/20 bg-blue-bg p-4 md:p-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-blue shadow-sm">
          <Icon name="shield-check-outline" size={20} />
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-text md:text-base">Keep your account safe</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-body md:text-sm">
            Use a password you don&apos;t reuse on other sites. This screen only updates the demo
            account — nothing is sent to a server yet.
          </p>
        </div>
      </div>
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
          <Button title="Update password" type="submit" icon="shield-check-outline" className="mt-2" />
        </form>
      </Card>
    </div>
  );
}
