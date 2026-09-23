"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import { faqs, supportEmail, supportPhone, supportWebsite } from "@/data/misc";
import { cn } from "@/lib/utils";

/** Mirrors `help_support_screen.dart`: contact cards, FAQ accordion, message form. */
export default function HelpPage() {
  const snack = useSnackbar();
  const [open, setOpen] = useState<number | null>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <BackAppBar title="Help & Support" fallbackHref="/settings" />
      <Page>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Contact icon="phone-calling-outline" label="Call us" value={supportPhone} href={`tel:${supportPhone.replace(/\s/g, "")}`} />
          <Contact icon="letter-outline" label="Email" value={supportEmail} href={`mailto:${supportEmail}`} />
          <Contact icon="global-outline" label="Website" value={supportWebsite.replace("https://", "")} href={supportWebsite} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-base font-bold text-text md:text-xl">Frequently asked</h2>
            <Card className="mt-3 divide-y divide-border">
              {faqs.map((f, i) => (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-start md:px-5 md:py-4"
                  >
                    <span className="flex-1 text-sm font-semibold text-text md:text-base">{f.q}</span>
                    <Icon
                      name="alt-arrow-down-outline"
                      size={18}
                      className={cn("text-text-muted transition-transform", open === i && "rotate-180")}
                    />
                  </button>
                  {open === i && <p className="px-4 pb-4 text-sm text-text-body md:px-5 md:text-base md:leading-relaxed">{f.a}</p>}
                </div>
              ))}
            </Card>
          </section>

          <section>
            <h2 className="text-base font-bold text-text md:text-xl">Send us a message</h2>
            <Card className="mt-3 p-4">
              <form
                className="flex flex-col gap-4"
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
                <TextField label="Subject" placeholder="Missing item, late order…" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <TextArea label="Message" placeholder="Tell us what happened" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button title="Send message" type="submit" icon="letter-outline" />
              </form>
            </Card>
          </section>
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
      className="flex flex-col items-center rounded-card border-[0.5px] border-border bg-card px-2 py-4 text-center shadow-card md:px-4 md:py-6"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-bg text-primary">
        <Icon name={icon} size={20} />
      </span>
      <span className="mt-2 text-xs font-bold text-text md:text-sm">{label}</span>
      <span className="mt-0.5 w-full truncate text-[10px] text-text-muted md:text-sm">{value}</span>
    </a>
  );
}
