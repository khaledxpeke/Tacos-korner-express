"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { OtpBoxes } from "@/components/auth/AuthWidgets";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import { fakeUser } from "@/data/misc";
import { cn } from "@/lib/utils";

/*
 * Screens only. With a backend, the server must generate the TOTP secret and recovery codes,
 * verify every 6-digit code, and store the enabled flag; the browser should never decide these.
 * Until then any 6 digits pass and the state lives in localStorage.
 */
const STORAGE_KEY = "tk_2fa";
const ISSUER = "Takos Korner";

type Stage = "off" | "scan" | "verify" | "codes" | "on";

interface Stored {
  enabledAt: string;
  codes: string[];
}

function readStored(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStored(v: Stored | null) {
  try {
    if (v) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: the demo simply forgets on reload.
  }
}

function randomChars(alphabet: string, n: number) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

const newSecret = () => randomChars("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", 32);
const newCodes = () =>
  Array.from({ length: 8 }, () => {
    const c = randomChars("abcdefghjkmnpqrstuvwxyz23456789", 10);
    return `${c.slice(0, 5)}-${c.slice(5)}`;
  });

/** Enable / disable authenticator-app sign-in: scan QR (or type the key), confirm a code, keep recovery codes. */
export function TwoFactorPanel({ onStatusChange }: { onStatusChange?: (on: boolean) => void }) {
  const snack = useSnackbar();
  const [stage, setStage] = useState<Stage>("off");
  const [stored, setStored] = useState<Stored | null>(null);
  const [secret, setSecret] = useState("");
  const [pendingCodes, setPendingCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [disabling, setDisabling] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  useEffect(() => {
    const s = readStored();
    // Reading localStorage has to wait for the client, so this syncs once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(s);
    setStage(s ? "on" : "off");
  }, []);

  function start() {
    setSecret(newSecret());
    setPendingCodes(newCodes());
    setCode("");
    setStage("scan");
  }

  function verify() {
    if (code.length !== 6) {
      snack.show("Enter the 6-digit code from your app", "warning");
      return;
    }
    setStage("codes");
  }

  function finish() {
    const s = { enabledAt: new Date().toISOString(), codes: pendingCodes };
    writeStored(s);
    setStored(s);
    setStage("on");
    onStatusChange?.(true);
    snack.show("Two-factor authentication is on", "success");
  }

  function disable() {
    if (code.length !== 6) {
      snack.show("Enter a code from your app to confirm", "warning");
      return;
    }
    writeStored(null);
    setStored(null);
    setDisabling(false);
    setShowCodes(false);
    setCode("");
    setStage("off");
    onStatusChange?.(false);
    snack.show("Two-factor authentication is off", "info");
  }

  if (stage === "off") {
    return (
      <Card className="p-5 md:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-bg text-amber">
            <Icon name="shield-keyhole-outline" size={28} />
          </span>
          <h2 className="mt-4 text-lg font-extrabold text-text">Add a second step to sign-in</h2>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-text-body">
            After your password, we&apos;ll ask for a 6-digit code from an authenticator app such as Google
            Authenticator, Microsoft Authenticator or Authy. Even if someone learns your password, they
            can&apos;t get in without your phone.
          </p>
          <StatusPill on={false} className="mt-4" />
          <div className="mt-6 w-full max-w-xs">
            <Button title="Enable two-factor authentication" icon="shield-check-outline" onClick={start} />
          </div>
        </div>
      </Card>
    );
  }

  if (stage === "scan" || stage === "verify") {
    return (
      <Card className="p-5 md:p-8">
        <SetupSteps current={stage === "scan" ? 0 : 1} />
        {stage === "scan" ? (
          <ScanStep secret={secret} onCancel={() => setStage("off")} onNext={() => setStage("verify")} />
        ) : (
          <div className="mt-6 flex flex-col items-center text-center">
            <h2 className="text-base font-extrabold text-text">Enter the code from your app</h2>
            <p className="mt-1 text-sm text-text-body">
              Open your authenticator app and type the 6-digit code shown for {ISSUER}.
            </p>
            <div className="mt-5 w-full max-w-sm">
              <OtpBoxes value={code} onChange={setCode} />
            </div>
            <div className="mt-6 flex w-full max-w-sm gap-3">
              <button
                type="button"
                onClick={() => setStage("scan")}
                className="inline-flex items-center gap-1.5 rounded-[12px] border border-text-muted-light bg-card px-5 text-sm font-bold text-text transition hover:border-primary hover:text-primary"
              >
                <Icon name="alt-arrow-left-outline" size={16} className="rtl:rotate-180" />
                Back
              </button>
              <Button title="Verify" icon="check-circle-bold" onClick={verify} className="flex-1" />
            </div>
          </div>
        )}
      </Card>
    );
  }

  if (stage === "codes") {
    return (
      <Card className="p-5 md:p-8">
        <SetupSteps current={2} />
        <div className="mt-6">
          <h2 className="text-base font-extrabold text-text">Save your recovery codes</h2>
          <p className="mt-1 text-sm text-text-body">
            If you lose your phone, each code lets you sign in once. Keep them somewhere safe — we won&apos;t
            show them again unless you ask.
          </p>
          <RecoveryCodes codes={pendingCodes} />
          <div className="mt-6">
            <Button title="I've saved them — turn on 2FA" icon="shield-check-outline" onClick={finish} />
          </div>
        </div>
      </Card>
    );
  }

  // stage === "on"
  return (
    <Card className="p-5 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-bg text-green">
          <Icon name="shield-check-bold" size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-extrabold text-text">Two-factor authentication</h2>
            <StatusPill on />
          </div>
          <p className="mt-0.5 text-sm text-text-body">
            Authenticator app
            {stored && <> · added {new Date(stored.enabledAt).toLocaleDateString()}</>}
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-border rounded-2xl border border-border">
        <button
          type="button"
          onClick={() => setShowCodes((v) => !v)}
          aria-expanded={showCodes}
          className="flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-bg"
        >
          <Icon name="key-minimalistic-outline" size={18} className="text-primary" />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-text">Recovery codes</span>
            <span className="block text-xs text-text-muted">Use one if you can&apos;t reach your phone</span>
          </span>
          <Icon
            name="alt-arrow-right-outline"
            size={16}
            className={cn("text-text-muted transition-transform", showCodes ? "rotate-90" : "rtl:rotate-180")}
          />
        </button>
        {showCodes && stored && (
          <div className="px-4 pb-4">
            <RecoveryCodes codes={stored.codes} />
          </div>
        )}
      </div>

      {disabling ? (
        <div className="mt-5 rounded-2xl border border-danger/30 bg-danger-bg/40 p-4">
          <p className="text-sm font-bold text-text">Turn off two-factor authentication?</p>
          <p className="mt-0.5 text-xs text-text-body">Enter a current code from your app to confirm.</p>
          <div className="mt-3 max-w-sm">
            <OtpBoxes value={code} onChange={setCode} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={disable}
              className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-danger px-4 text-sm font-bold text-white transition hover:brightness-95"
            >
              <Icon name="shield-cross-outline" size={16} />
              Turn off
            </button>
            <button
              type="button"
              onClick={() => {
                setDisabling(false);
                setCode("");
              }}
              className="h-10 rounded-[12px] border border-text-muted-light bg-card px-4 text-sm font-bold text-text"
            >
              Keep it on
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setDisabling(true)}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-[12px] border border-danger/30 bg-card px-4 text-sm font-bold text-danger transition hover:bg-danger-bg"
        >
          <Icon name="shield-cross-outline" size={18} />
          Disable two-factor authentication
        </button>
      )}
    </Card>
  );
}

function StatusPill({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
        on ? "bg-green-bg text-green" : "bg-card-gray text-text-muted",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-green" : "bg-text-muted")} />
      {on ? "On" : "Off"}
    </span>
  );
}

function SetupSteps({ current }: { current: number }) {
  const labels = ["Scan", "Verify", "Recovery codes"];
  return (
    <ol className="flex items-center gap-2">
      {labels.map((l, i) => (
        <li key={l} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
              i < current ? "bg-green text-white" : i === current ? "bg-primary text-white" : "bg-card-gray text-text-muted",
            )}
          >
            {i < current ? <Icon name="check-read-outline" size={13} /> : i + 1}
          </span>
          <span className={cn("text-xs font-semibold", i === current ? "text-text" : "text-text-muted")}>{l}</span>
          {i < labels.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
        </li>
      ))}
    </ol>
  );
}

function ScanStep({ secret, onCancel, onNext }: { secret: string; onCancel: () => void; onNext: () => void }) {
  const snack = useSnackbar();
  const [mode, setMode] = useState<"qr" | "key">("qr");
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const label = encodeURIComponent(`${ISSUER}:${fakeUser.email}`);
    const url = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(ISSUER)}&digits=6&period=30`;
    let alive = true;
    QRCode.toDataURL(url, { margin: 1, width: 360, errorCorrectionLevel: "M" })
      .then((data) => alive && setQr(data))
      .catch(() => alive && setMode("key"));
    return () => {
      alive = false;
    };
  }, [secret]);

  const grouped = secret.match(/.{1,4}/g)?.join(" ") ?? secret;

  return (
    <div className="mt-6">
      <h2 className="text-base font-extrabold text-text">
        {mode === "qr" ? "Scan this QR code" : "Enter this key in your app"}
      </h2>
      <p className="mt-1 text-sm text-text-body">
        {mode === "qr"
          ? "In your authenticator app, tap Add account → Scan a QR code."
          : "In your authenticator app, choose Enter a setup key, name it Takos Korner, and pick time-based."}
      </p>

      <div className="mt-5 flex flex-col items-center">
        {mode === "qr" ? (
          <div className="grid h-52 w-52 place-items-center rounded-2xl border border-border bg-white p-3 shadow-card">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL generated in the browser
              <img src={qr} alt="QR code for your authenticator app" className="h-full w-full" />
            ) : (
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            )}
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-border bg-bg p-4 text-center">
            <p className="text-[11px] font-bold tracking-wide text-text-muted">SETUP KEY</p>
            <p dir="ltr" className="mt-1.5 font-mono text-base font-bold tracking-wider break-all text-text">
              {grouped}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(secret);
                snack.show("Key copied", "success");
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-text shadow-card hover:text-primary"
            >
              <Icon name="copy-outline" size={14} />
              Copy key
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMode(mode === "qr" ? "key" : "qr")}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          <Icon name={mode === "qr" ? "keyboard-outline" : "qr-code-outline"} size={16} />
          {mode === "qr" ? "Can't scan? Enter the key instead" : "Scan a QR code instead"}
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[12px] border border-text-muted-light bg-card px-5 text-sm font-bold text-text transition hover:border-primary hover:text-primary"
        >
          Cancel
        </button>
        <Button title="Next" icon="alt-arrow-right-outline" iconRight onClick={onNext} className="flex-1" />
      </div>
    </div>
  );
}

function RecoveryCodes({ codes }: { codes: string[] }) {
  const snack = useSnackbar();
  const text = codes.join("\n");

  function download() {
    const url = URL.createObjectURL(new Blob([`${ISSUER} recovery codes\n\n${text}\n`], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "takos-korner-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-4">
      <ul dir="ltr" className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-bg p-4">
        {codes.map((c) => (
          <li key={c} className="font-mono text-sm font-semibold text-text">
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(text);
            snack.show("Recovery codes copied", "success");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-text hover:border-primary hover:text-primary"
        >
          <Icon name="copy-outline" size={14} />
          Copy
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-text hover:border-primary hover:text-primary"
        >
          <Icon name="download-minimalistic-outline" size={14} />
          Download
        </button>
      </div>
    </div>
  );
}
