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

/** Floating snackbar. Mirrors `custom_snackbar.dart`. */
export function Snackbar({
  message,
  type = "info",
}: {
  message: string;
  type?: SnackbarType;
}) {
  const s = styles[type];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-5">
      <div
        role="status"
        className={cn(
          "slide-up flex max-w-[560px] items-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold text-white shadow-lg",
          s.bg,
        )}
      >
        <Icon name={s.icon} size={18} />
        {message}
      </div>
    </div>
  );
}
