"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthHeader, OtpBoxes, PasswordStrengthBar, passwordStrength } from "@/components/auth/AuthWidgets";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { useSnackbar } from "@/context/SnackbarContext";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors `forgot_password_screen.dart`: email → OTP → new password. Nothing is sent. */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  function sendCode() {
    if (!emailRe.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError(undefined);
    setSeconds(30);
    setStep(1);
    snack.show("Code sent (demo: any 6 digits work)", "info");
  }

  function verify() {
    if (otp.length !== 6) {
      snack.show("Enter the 6-digit code", "warning");
      return;
    }
    setStep(2);
  }

  function reset() {
    if (passwordStrength(pw) < 2) {
      setError("Use 8+ chars with a number or capital");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError(undefined);
    snack.show("Password updated", "success");
    router.push("/login");
  }

  const titles = ["Forgot password?", "Check your inbox", "New password"];
  const subs = [
    "Enter your email and we'll send a reset code.",
    `We sent a 6-digit code to ${email}.`,
    "Choose a strong password you don't use elsewhere.",
  ];

  return (
    <div className="flex flex-1 flex-col">
      <AuthHeader
        title={titles[step]}
        subtitle={subs[step]}
        showBack
        onBack={() => (step > 0 ? setStep((s) => (s - 1) as 0 | 1 | 2) : router.push("/login"))}
      />
      <div className="flex flex-1 flex-col gap-4 px-7 py-7">
        {step === 0 && (
          <>
            <TextField
              label="Email"
              type="email"
              icon="letter-outline"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              autoFocus
            />
            <Button title="Send code" icon="letter-outline" onClick={sendCode} className="mt-2" />
          </>
        )}
        {step === 1 && (
          <>
            <OtpBoxes value={otp} onChange={setOtp} />
            <Button title="Verify" onClick={verify} className="mt-4" />
            <button
              type="button"
              disabled={seconds > 0}
              onClick={() => {
                setSeconds(30);
                snack.show("Code re-sent", "info");
              }}
              className="text-center text-xs font-semibold text-primary disabled:text-text-muted"
            >
              {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <TextField
                label="New password"
                type="password"
                icon="lock-password-outline"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="new-password"
              />
              <PasswordStrengthBar password={pw} />
            </div>
            <TextField
              label="Confirm password"
              type="password"
              icon="lock-password-outline"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={error}
              autoComplete="new-password"
            />
            <Button title="Update password" icon="shield-check-outline" onClick={reset} className="mt-2" />
          </>
        )}
        <span className="flex-1" />
        <Link href="/login" className="flex items-center justify-center gap-1 text-sm font-semibold text-text-body">
          <Icon name="alt-arrow-left-outline" size={16} className="rtl:rotate-180" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
