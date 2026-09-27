"use client";

import { BottomSheet } from "@/components/ui/Dialog";
import type { LegalDoc } from "@/data/legal";

/** Legal copy in a sheet, so auth screens can show it without leaving the flow or the site chrome appearing. */
export function LegalSheet({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  return (
    <BottomSheet open={!!doc} onClose={onClose} title={doc?.title}>
      {doc && (
        <div className="px-5">
          <p className="text-xs text-text-muted">Last updated {doc.updated}</p>
          {doc.intro && <p className="mt-3 text-sm leading-relaxed text-text">{doc.intro}</p>}
          {doc.sections.map((s, i) => (
            <section key={s.title} className="mt-5">
              <h3 className="text-sm font-bold text-text">
                {i + 1}. {s.title}
              </h3>
              {s.body.map((p, k) => (
                <p key={k} className="mt-1.5 text-sm leading-relaxed text-text-body">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
