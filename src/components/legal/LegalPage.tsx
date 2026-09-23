import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Card } from "@/components/ui/Misc";

export interface LegalSection {
  title: string;
  body: string[];
}

/** Static legal page. Placeholder copy until legal provides the real text. */
export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
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
          </Card>
        </div>
      </Page>
    </>
  );
}
