"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthHeader, OtpBoxes, PasswordStrengthBar, isPasswordAcceptable } from "@/components/auth/AuthWidgets";
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
    if (!isPasswordAcceptable(pw)) {
      setError("Meet the password requirements above");
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
      <AuthHeader title={titles[step]} subtitle={subs[step]} />
      <div className="flex flex-1 flex-col gap-4 px-7 py-7 md:px-0">
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
            <div className="flex items-center justify-center gap-2 text-sm text-text-body">
              Didn&apos;t get it?
              {seconds > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 font-semibold text-text shadow-card">
                  <Icon name="clock-circle-outline" size={15} className="text-amber" />
                  Resend in <span className="tabular-nums text-primary">0:{String(seconds).padStart(2, "0")}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSeconds(30);
                    snack.show("Code re-sent", "info");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-bg px-3 py-1.5 font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  <Icon name="restart-outline" size={15} />
                  Resend code
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setOtp("");
                setStep(0);
              }}
              className="text-center text-sm font-semibold text-text-body underline-offset-2 hover:text-primary hover:underline"
            >
              Use a different email
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
