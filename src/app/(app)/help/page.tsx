"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { SearchField, TextArea, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Card, EmptyCard } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import { faqs, supportEmail, supportPhone, supportWebsite } from "@/data/misc";
import { cn } from "@/lib/utils";

/** FAQ search + accordion on the left; contact options and message form on the right. */
export default function HelpPage() {
  const snack = useSnackbar();
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const q = query.trim().toLowerCase();
  const results = q ? faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) : faqs;

  return (
    <>
      <BackAppBar title="Help & Support" subtitle="Answers to common questions and ways to reach us" fallbackHref="/settings" />
      <Page>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-text md:text-2xl">Frequently asked questions</h2>
                <p className="mt-1 text-sm text-text-muted">Quick answers to what people ask us most.</p>
              </div>
              <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-body sm:inline">
                {results.length} {results.length === 1 ? "question" : "questions"}
              </span>
            </div>
            <SearchField
              className="mt-4"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {results.length === 0 ? (
              <EmptyCard
                className="mt-4"
                icon="question-circle-outline"
                title="No matching questions"
                message="Try other words, or send us a message and we'll help."
              />
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {results.map((f) => {
                  const on = open === f.q;
                  return (
                    <li
                      key={f.q}
                      className={cn(
                        "overflow-hidden rounded-2xl border bg-card shadow-card transition-colors",
                        on ? "border-primary/30 ring-1 ring-primary/10" : "border-border hover:border-text-muted-light",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(on ? null : f.q)}
                        aria-expanded={on}
                        className="flex w-full items-center gap-3 px-4 py-4 text-start md:px-5"
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors",
                            on ? "bg-primary text-white" : "bg-primary-bg text-primary",
                          )}
                        >
                          <Icon name="question-circle-outline" size={18} />
                        </span>
                        <span className="flex-1 text-sm font-bold text-text md:text-[15px]">{f.q}</span>
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full border transition",
                            on ? "border-primary bg-primary-bg text-primary" : "border-border text-text-muted",
                          )}
                        >
                          {/* Points to the reading direction when closed (right in LTR, left in RTL), down when open. */}
                          <Icon
                            name="alt-arrow-right-outline"
                            size={15}
                            className={cn("transition-transform duration-300", on ? "rotate-90" : "rtl:rotate-180")}
                          />
                        </span>
                      </button>
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows] duration-300 ease-out",
                          on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="px-4 pb-4 ps-16 text-sm leading-relaxed text-text-body md:px-5 md:ps-17">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5">
              <h2 className="text-base font-extrabold text-text">Still need help?</h2>
              <p className="mt-0.5 text-sm text-text-muted">We usually reply in under an hour.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Contact
                  icon="phone-calling-outline"
                  label="Call us"
                  value={supportPhone}
                  href={`tel:${supportPhone.replace(/\s/g, "")}`}
                />
                <Contact icon="letter-outline" label="Email" value={supportEmail} href={`mailto:${supportEmail}`} />
                <Contact
                  icon="global-outline"
                  label="Website"
                  value={supportWebsite.replace("https://", "")}
                  href={supportWebsite}
                />
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-extrabold text-text">Send us a message</h2>
              <form
                className="mt-4 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!subject.trim() || message.trim().length < 10) {
                    snack.show("Add a subject and a few more details", "warning");
                    return;
                  }
                  setSubject("");
                  setMessage("");
                  snack.show("Message sent — we reply within 24h", "success");
                }}
              >
                <TextField
                  label="Subject"
                  placeholder="Missing item, late order…"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <TextArea
                  label="Message"
                  placeholder="Tell us what happened"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button title="Send message" type="submit" icon="letter-outline" />
              </form>
            </Card>
          </aside>
        </div>
      </Page>
    </>
  );
}

function Contact({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 transition hover:border-primary/30 hover:bg-primary-bg/40"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-bg text-primary">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-text">{label}</span>
        <span className="block truncate text-xs text-text-muted">{value}</span>
      </span>
      <Icon
        name="alt-arrow-right-outline"
        size={16}
        className="text-text-muted transition group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180"
      />
    </a>
  );
}
