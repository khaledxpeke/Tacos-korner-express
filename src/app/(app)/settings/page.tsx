"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Dialog } from "@/components/ui/Dialog";
import { Switch } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { languages, useLanguage } from "@/context/LanguageContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const { isDark, toggle } = useTheme();
  const [logout, setLogout] = useState(false);

  return (
    <>
      <BackAppBar title="Settings" subtitle="Language, appearance, and support" fallbackHref="/profile" />
      <Page className="md:py-5">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <Section title="Preferences">
            <LanguageRow />
            <div className="flex items-center gap-3 px-4 py-3 md:px-5">
              <RowIcon icon="moon-outline" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-text">Dark mode</span>
                <span className="block text-xs text-text-muted">{isDark ? "On" : "Off"}</span>
              </span>
              <Switch checked={isDark} onChange={toggle} label="Dark mode" />
            </div>
          </Section>

          <Section title="Support">
            <Row icon="question-circle-outline" title="Help & support" description="FAQs and contact" href="/help" />
            <Row icon="info-circle-outline" title="About" description="Takos Korner" href="/about" />
            <Row
              icon="star-outline"
              title="Rate the site"
              description="Coming soon"
              href="/coming-soon?feature=Ratings"
              badge="Soon"
            />
          </Section>

          <Section title="Legal">
            <Row
              icon="document-text-outline"
              title="Terms of Service"
              description="Orders, payments, cancellations and refunds"
              href="/terms"
            />
            <Row
              icon="shield-user-outline"
              title="Privacy Policy"
              description="What we collect, why, and your rights"
              href="/privacy"
            />
          </Section>

          <button
            type="button"
            onClick={() => setLogout(true)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] border border-danger/30 bg-card text-sm font-bold text-danger shadow-card transition hover:bg-danger-bg"
          >
            <Icon name="logout-2-outline" size={18} />
            Log out
          </button>
        </div>
      </Page>

      <Dialog
        open={logout}
        onClose={() => setLogout(false)}
        title="Log out"
        message="Are you sure you want to log out?"
        confirmText="Log out"
        danger
        onConfirm={() => {
          snack.show("Logged out", "info");
          router.push("/login");
        }}
      />
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-sm font-extrabold text-text">{title}</h2>
      <div className="divide-y divide-border overflow-visible rounded-2xl border border-border bg-card shadow-card">
        {children}
      </div>
    </section>
  );
}

function RowIcon({ icon }: { icon: string }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary">
      <Icon name={icon} size={18} />
    </span>
  );
}

function Row({
  icon,
  title,
  description,
  href,
  badge,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="group flex items-center gap-3 px-4 py-3 text-start transition hover:bg-bg md:px-5">
      <RowIcon icon={icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text">{title}</span>
        <span className="block truncate text-xs text-text-muted">{description}</span>
      </span>
      {badge && (
        <span className="shrink-0 rounded-full bg-bg px-2 py-0.5 text-[10px] font-bold text-text-muted">{badge}</span>
      )}
      <Icon
        name="alt-arrow-right-outline"
        size={18}
        className="shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180"
      />
    </Link>
  );
}

function LanguageRow() {
  const snack = useSnackbar();
  const { language, setLanguage } = useLanguage();
  const current = languages.find((l) => l.code === language)!;
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function hide(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", hide);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", hide);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={box} className={cn("relative", open && "z-20")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-bg md:px-5"
      >
        <RowIcon icon="global-outline" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-text">Language</span>
          <span className="block text-xs text-text-muted">Site language</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-text">
          <Image src={`/images/flags/${language}.png`} alt="" width={18} height={18} className="rounded-full" />
          {current.native}
          <Icon
            name="alt-arrow-down-outline"
            size={16}
            className={cn("text-text-muted transition", open && "rotate-180")}
          />
        </span>
      </button>
      {open && (
        <div className="absolute end-4 top-full z-20 mt-1 w-64 overflow-hidden rounded-2xl border border-border bg-card py-1 shadow-lg">
          {languages.map((l) => {
            const on = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                  snack.show(`Language set to ${l.label}`, "success");
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-start hover:bg-card-gray",
                  on && "bg-primary-bg",
                )}
              >
                <Image src={`/images/flags/${l.code}.png`} alt="" width={22} height={22} className="rounded-full" />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-text">{l.native}</span>
                  <span className="block text-xs text-text-muted">{l.label}</span>
                </span>
                {on && <Icon name="check-circle-bold" size={18} className="text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
