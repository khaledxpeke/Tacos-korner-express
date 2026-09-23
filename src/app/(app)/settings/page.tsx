"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { BottomSheet, Dialog } from "@/components/ui/Dialog";
import { Switch } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Card, ListTile } from "@/components/ui/Misc";
import { languages, useLanguage } from "@/context/LanguageContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

/** Mirrors `settings_screen.dart`: Account, Orders, Preferences, Support sections. */
export default function SettingsPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const { isDark, toggle } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const current = languages.find((l) => l.code === language)!;

  return (
    <>
      <BackAppBar title="Settings" fallbackHref="/profile" />
      <Page>
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Account">
            <ListTile icon="user-circle-outline" title="Edit Profile" href="/settings/edit-profile" />
            <ListTile icon="lock-password-outline" title="Change Password" href="/settings/change-password" />
          </Section>
          <Section title="Orders">
            <ListTile icon="bag-4-outline" iconTone="blue" title="My Orders" href="/orders" />
            <ListTile icon="heart-outline" iconTone="danger" title="Favourites" href="/favorites" />
            <ListTile icon="bookmark-outline" iconTone="amber" title="Saved Combos" href="/saved-combos" />
          </Section>
          <Section title="Preferences">
            <ListTile
              icon="global-outline"
              iconTone="green"
              title="Language"
              subtitle={current.native}
              onClick={() => setLangOpen(true)}
              trailing={
                <span className="flex items-center gap-2 text-xs text-text-muted">
                  <Image src={`/images/flags/${language}.png`} alt="" width={18} height={18} className="rounded-full" />
                  <Icon name="alt-arrow-right-outline" size={18} className="rtl:rotate-180" />
                </span>
              }
            />
            <ListTile
              icon={isDark ? "sun-outline" : "moon-outline"}
              iconTone="purple"
              title={isDark ? "Light Mode" : "Dark Mode"}
              subtitle={isDark ? "Currently dark" : "Currently light"}
              onClick={toggle}
              trailing={<Switch checked={isDark} onChange={toggle} label="Dark mode" />}
            />
            <ListTile icon="bell-outline" iconTone="blue" title="Notifications" href="/settings/notifications" />
          </Section>
          <Section title="Support">
            <ListTile icon="question-circle-outline" iconTone="green" title="Help & Support" href="/help" />
            <ListTile icon="star-outline" iconTone="amber" title="Rate Takos Korner" href="/coming-soon?feature=Ratings" />
            <ListTile icon="info-circle-outline" iconTone="muted" title="About" href="/about" />
            <ListTile
              icon="logout-2-outline"
              iconTone="danger"
              title="Logout"
              onClick={() => setLogout(true)}
              trailing={<span />}
            />
          </Section>
        </div>
        <p className="mt-6 text-center text-xs text-text-muted md:text-sm">Takos Korner · Web</p>
      </Page>

      <BottomSheet open={langOpen} onClose={() => setLangOpen(false)} title="Language">
        <div className="flex flex-col gap-2 px-5">
          {languages.map((l) => {
            const on = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setLangOpen(false);
                  snack.show(`Language set to ${l.label}`, "success");
                }}
                className={cn(
                  "flex items-center gap-3 rounded-card border p-3 text-start",
                  on ? "border-primary bg-primary-bg" : "border-border",
                )}
              >
                <Image src={`/images/flags/${l.code}.png`} alt="" width={28} height={28} className="rounded-full" />
                <span className="flex-1">
                  <span className="block text-sm font-bold text-text">{l.native}</span>
                  <span className="block text-xs text-text-muted">{l.label}</span>
                </span>
                {on && <Icon name="check-circle-bold" size={20} className="text-primary" />}
              </button>
            );
          })}
        </div>
      </BottomSheet>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2 px-1 text-xs font-bold tracking-wide text-text-muted md:text-sm md:tracking-normal">{title}</p>
      <Card className="divide-y divide-border">{children}</Card>
    </section>
  );
}
