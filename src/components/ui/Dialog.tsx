"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  danger?: boolean;
  variant?: "confirm" | "error" | "info";
}

/** Mirrors `custom_confirmation_dialog.dart` and `custom_error_dialog.dart`. */
export function Dialog({
  open,
  onClose,
  title,
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  danger,
  variant = "confirm",
}: Props) {
  if (!open) return null;
  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[20px] bg-card p-6 text-center shadow-lg"
      >
        <div
          className={cn(
            "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full",
            variant === "error"
              ? "bg-danger-bg text-danger"
              : danger
                ? "bg-danger-bg text-danger"
                : "bg-primary-bg text-primary",
          )}
        >
          <Icon
            name={
              variant === "error"
                ? "close-circle-bold"
                : danger
                  ? "danger-triangle-bold"
                  : "question-circle-outline"
            }
            size={30}
          />
        </div>
        <h2 className="text-base font-bold text-text">{title}</h2>
        {message && <p className="mt-2 text-sm text-text-body">{message}</p>}
        {children}
        <div className="mt-6 flex gap-3">
          {variant === "confirm" && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[12px] border border-border py-3 text-sm font-semibold text-text"
            >
              {cancelText}
            </button>
          )}
          <Button
            title={variant === "confirm" ? confirmText : "OK"}
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            bgClass={danger || variant === "error" ? "bg-danger" : undefined}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

/** Bottom sheet, used for quick peek, filters, etc. */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "slide-up max-h-[88dvh] w-full max-w-[600px] overflow-y-auto rounded-t-[24px] bg-card pb-[max(1.25rem,env(safe-area-inset-bottom))] md:rounded-2xl md:pb-6 md:shadow-xl",
          className,
        )}
      >
        <div className="sticky top-0 z-10 bg-card pt-3 md:rounded-t-2xl">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" />
          {title && (
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-base font-bold text-text">{title}</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full bg-card-gray text-text"
              >
                <Icon name="close-circle-bold" size={18} />
              </button>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
