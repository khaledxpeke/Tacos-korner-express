"use client";

import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export type SnackbarType = "success" | "error" | "info" | "warning";

const styles: Record<SnackbarType, { bg: string; icon: string }> = {
  success: { bg: "bg-success", icon: "check-circle-bold" },
  error: { bg: "bg-danger", icon: "close-circle-bold" },
  info: { bg: "bg-info", icon: "info-circle-bold" },
  warning: { bg: "bg-warning", icon: "danger-triangle-bold" },
};

/** Toast: bottom-center on phones, top-right from `sm`, with a shrinking timer line. */
export function Snackbar({
  message,
  type = "info",
  duration,
  paused,
  onPause,
  onResume,
  onClose,
}: {
  message: string;
  type?: SnackbarType;
  duration: number;
  paused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onClose?: () => void;
}) {
  const s = styles[type];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-5 sm:inset-x-auto sm:end-5 sm:top-20 sm:bottom-auto sm:justify-end sm:px-0">
      <div
        role="status"
        onMouseEnter={onPause}
        onMouseLeave={onResume}
        className={cn(
          "toast-in pointer-events-auto relative flex w-full max-w-[560px] items-center gap-2.5 overflow-hidden rounded-[12px] py-3 ps-4 pe-2 text-sm font-semibold text-white shadow-lg sm:w-auto sm:min-w-[300px] sm:max-w-[380px]",
          s.bg,
          paused && "toast-paused",
        )}
      >
        <Icon name={s.icon} size={18} />
        <span className="flex-1">{message}</span>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
        >
          <Icon name="close-circle-linear" size={16} />
        </button>
        <span
          aria-hidden
          className="toast-timer absolute inset-x-0 bottom-0 h-[3px] bg-white/60"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
