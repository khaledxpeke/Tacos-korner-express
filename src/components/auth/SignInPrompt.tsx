"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useBodyScrollLock, useEscapeKey } from "@/lib/useBodyScrollLock";

/** Guests hit this before account-only actions such as checkout. */
export function SignInPrompt({
  open,
  onClose,
  title = "Sign in to check out",
  message = "Your cart stays as it is. Sign in or create an account to place your order and track it.",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  useBodyScrollLock(open);
  useEscapeKey(open, onClose);
  if (!open) return null;
  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="signin-prompt-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[20px] bg-card p-6 text-center shadow-lg"
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-bg text-primary">
          <Icon name="lock-keyhole-outline" size={28} />
        </div>
        <h2 id="signin-prompt-title" className="text-base font-bold text-text">
          {title}
        </h2>
        <p className="mt-2 text-sm text-text-body">{message}</p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center gap-2 rounded-[12px] bg-linear-to-r from-primary to-primary-dark text-sm font-bold text-white shadow-card"
          >
            <Icon name="login-2-outline" size={18} />
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex h-12 items-center justify-center gap-2 rounded-[12px] border border-border bg-card text-sm font-bold text-text transition hover:border-primary hover:text-primary"
          >
            <Icon name="user-plus-rounded-outline" size={18} />
            Create account
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-xs font-semibold text-text-muted hover:text-text"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
