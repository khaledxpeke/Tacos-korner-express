"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { privacyDoc, termsDoc } from "@/data/legal";
import { useBodyScrollLock, useEscapeKey } from "@/lib/useBodyScrollLock";
import { cn } from "@/lib/utils";

export type LegalKind = "terms" | "privacy";

export const legalDocs = {
  terms: { doc: termsDoc, icon: "document-text-outline", short: "Terms" },
  privacy: { doc: privacyDoc, icon: "shield-user-outline", short: "Privacy" },
} as const;

/** Rough reading time: ~200 words a minute. */
export function readMinutes(kind: LegalKind) {
  const { doc } = legalDocs[kind];
  const words = [doc.intro ?? "", ...doc.sections.flatMap((s) => s.body)].join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Terms and privacy in one sheet, so auth screens can show them without leaving the flow.
 * Tabs switch documents; sections fold so the outline reads at a glance.
 */
export function LegalSheet({
  open,
  onClose,
  onAccept,
}: {
  open: LegalKind | null;
  onClose: () => void;
  /** Shows an "I agree" button that accepts both documents. */
  onAccept?: () => void;
}) {
  useBodyScrollLock(!!open);
  useEscapeKey(!!open, onClose);
  if (!open) return null;
  return <LegalSheetBody key={open} initial={open} onClose={onClose} onAccept={onAccept} />;
}

function LegalSheetBody({
  initial,
  onClose,
  onAccept,
}: {
  initial: LegalKind;
  onClose: () => void;
  onAccept?: () => void;
}) {
  const [kind, setKind] = useState<LegalKind>(initial);
  const [expanded, setExpanded] = useState<number | null>(0);
  const { doc, icon } = legalDocs[kind];

  function switchTo(next: LegalKind) {
    setKind(next);
    setExpanded(0);
  }

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="legal-title"
        onClick={(e) => e.stopPropagation()}
        className="slide-up flex max-h-[90dvh] w-full max-w-[600px] flex-col overflow-hidden rounded-t-[24px] bg-card md:rounded-2xl md:shadow-xl"
      >
        {/* Tabs */}
        <div className="shrink-0 border-b border-border px-5 pb-3 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" />
          <div className="flex items-center gap-3">
            <div className="grid flex-1 grid-cols-2 gap-1 rounded-full border border-border bg-bg p-1">
              {(Object.keys(legalDocs) as LegalKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={kind === k}
                  onClick={() => switchTo(k)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition md:text-sm",
                    kind === k ? "bg-primary text-white shadow-sm" : "text-text-body hover:text-text",
                  )}
                >
                  <Icon name={legalDocs[k].icon} size={16} />
                  {legalDocs[k].doc.title}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card-gray text-text transition hover:text-primary"
            >
              <Icon name="close-circle-bold" size={20} />
            </button>
          </div>
        </div>

        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 pb-5 pt-5">
          {/* Summary */}
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-bg text-primary">
              <Icon name={icon} size={24} />
            </span>
            <div className="min-w-0">
              <h2 id="legal-title" className="text-lg font-extrabold text-text">
                {doc.title}
              </h2>
              <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold text-text-muted">
                <span className="inline-flex items-center gap-1 rounded-full bg-bg px-2 py-0.5">
                  <Icon name="calendar-outline" size={12} />
                  Updated {doc.updated}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-bg px-2 py-0.5">
                  <Icon name="list-outline" size={12} />
                  {doc.sections.length} sections
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-bg px-2 py-0.5">
                  <Icon name="clock-circle-outline" size={12} />
                  {readMinutes(kind)} min read
                </span>
              </div>
            </div>
          </div>
          {doc.intro && (
            <p className="mt-4 rounded-2xl border-s-4 border-primary bg-primary-bg/60 px-4 py-3 text-sm leading-relaxed text-text">
              {doc.intro}
            </p>
          )}

          {/* Sections */}
          <ol className="mt-4 flex flex-col gap-2">
            {doc.sections.map((s, i) => {
              const on = expanded === i;
              return (
                <li key={s.title} className={cn("rounded-2xl border transition", on ? "border-primary/30 bg-card shadow-card" : "border-border bg-bg")}>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setExpanded(on ? null : i)}
                    className="flex w-full items-center gap-3 px-3.5 py-3 text-start"
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold",
                        on ? "bg-primary text-white" : "bg-card text-text-body",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-bold text-text">{s.title}</span>
                    <Icon
                      name="alt-arrow-down-outline"
                      size={16}
                      className={cn("shrink-0 text-text-muted transition", on && "rotate-180 text-primary")}
                    />
                  </button>
                  {on && (
                    <div className="px-3.5 pb-3.5 ps-[3.25rem]">
                      {s.body.map((p, k) => (
                        <p key={k} className={cn("text-sm leading-relaxed text-text-body", k > 0 && "mt-2")}>
                          {p}
                        </p>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="shrink-0 border-t border-border bg-card px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {onAccept ? (
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[12px] border border-border px-5 text-sm font-bold text-text transition hover:border-primary hover:text-primary"
              >
                Close
              </button>
              <Button
                title="I agree to both"
                icon="check-circle-bold"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
              />
            </div>
          ) : (
            <Button title="Done" onClick={onClose} />
          )}
          {onAccept && (
            <p className="mt-2 text-center text-[11px] text-text-muted">
              Accepts the Terms of Service and the Privacy Policy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
