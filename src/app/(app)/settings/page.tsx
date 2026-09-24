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
      <BackAppBar
        title="Settings"
        subtitle="Account, language, and appearance"
        fallbackHref="/profile"
        trailing={
          <button
            type="button"
            onClick={() => setLogout(true)}
            className="hidden text-sm font-semibold text-danger hover:underline md:inline"
          >
            Log out
          </button>
        }
      />
      <Page className="md:py-5">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <Section title="Account">
            <Row title="Profile" description="Name, email, and photo" href="/settings/edit-profile" action="Edit" />
            <Row title="Password" description="Change your password" href="/settings/change-password" action="Change" />
          </Section>

          <Section title="Orders">
            <Row title="My orders" description="Active and past orders" href="/orders" action="View" />
            <Row title="Favourites" description="Dishes and restaurants" href="/favorites" action="View" />
            <Row title="Saved combos" description="Custom builds to reorder" href="/saved-combos" action="View" />
          </Section>

          <Section title="Preferences">
            <LanguageRow />
            <div className="flex items-center gap-4 px-5 py-3">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-text">Dark mode</span>
                <span className="block text-xs text-text-muted">{isDark ? "On" : "Off"}</span>
              </span>
              <Switch checked={isDark} onChange={toggle} label="Dark mode" />
            </div>
            <Row title="Notifications" description="Orders and offers" href="/settings/notifications" action="Manage" />
          </Section>

          <Section title="Support">
            <Row title="Help & support" description="FAQs and contact" href="/help" action="Open" />
            <Row title="About" description="Takos Korner" href="/about" action="Open" />
            <Row title="Rate the site" description="Coming soon" href="/coming-soon?feature=Ratings" action="Soon" />
          </Section>
        </div>

        <button
          type="button"
          onClick={() => setLogout(true)}
          className="mt-5 text-sm font-semibold text-danger md:hidden"
        >
          Log out
        </button>
      </Page>

      <Dialog
        open={logout}
        onClose={() => setLogout(false)}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
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
      <h2 className="mb-2 text-sm font-extrabold text-text">{title}</h2>
      <div className="divide-y divide-border overflow-visible rounded-2xl border border-border bg-card shadow-card">
        {children}
      </div>
    </section>
  );
}

function Row({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-4 px-5 py-3 text-start transition hover:bg-card-gray">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text">{title}</span>
        <span className="block text-xs text-text-muted">{description}</span>
      </span>
      <span className="shrink-0 text-sm font-semibold text-primary">{action}</span>
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
        className="flex w-full items-center gap-4 px-5 py-3 text-start transition hover:bg-card-gray"
      >
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
