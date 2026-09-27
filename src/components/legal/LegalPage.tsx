import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";

export interface LegalSection {
  title: string;
  body: string[];
}

/** Static legal page. Placeholder copy until legal provides the real text. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <BackAppBar title={title} subtitle={`Last updated ${updated}`} fallbackHref="/settings" />
      <Page>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block">
            <ol className="sticky top-24 flex flex-col gap-1 text-sm">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`} className="block rounded-lg px-3 py-1.5 text-text-body hover:bg-card hover:text-primary">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <Card className="p-5 md:p-8">
            <p className="rounded-[12px] bg-warning-bg px-3 py-2 text-xs text-warning">
              Placeholder text. Replace with the final legal copy before launch.
            </p>
            {intro && <p className="mt-5 text-sm leading-relaxed text-text md:text-base">{intro}</p>}
            {sections.map((s, i) => (
              <section key={s.title} id={`s${i + 1}`} className="mt-6 scroll-mt-24">
                <h2 className="text-base font-bold text-text">
                  {i + 1}. {s.title}
                </h2>
                {s.body.map((p, k) => (
                  <p key={k} className="mt-2 text-sm leading-relaxed text-text-body">
                    {p}
                  </p>
                ))}
              </section>
            ))}
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/help", label: "Help & support" },
              ]
                .filter((l) => l.label !== title)
                .map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-body transition hover:border-primary/40 hover:text-primary"
                  >
                    {l.label}
                    <Icon name="alt-arrow-right-outline" size={12} className="rtl:rotate-180" />
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </Page>
    </>
  );
}
