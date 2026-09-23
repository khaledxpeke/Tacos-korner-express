"use client";

import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Switch } from "@/components/ui/Fields";
import { Card, ListTile } from "@/components/ui/Misc";
import { useLocalStorage } from "@/lib/useLocalStorage";

const prefs = [
  { key: "orders", icon: "bag-4-outline", tone: "blue", title: "Order updates", sub: "Status changes and courier ETA" },
  { key: "promos", icon: "ticket-sale-outline", tone: "amber", title: "Promotions", sub: "Deals, codes and weekend offers" },
  { key: "reels", icon: "video-frame-play-horizontal-outline", tone: "purple", title: "New reels", sub: "When restaurants you follow post" },
  { key: "reminders", icon: "clock-circle-outline", tone: "green", title: "Reminders", sub: "Lunch time nudges and cart reminders" },
  { key: "email", icon: "letter-outline", tone: "muted", title: "Email digest", sub: "Weekly summary by email" },
] as const;

type Prefs = Record<(typeof prefs)[number]["key"], boolean>;

/** Mirrors `notification_settings_screen.dart`. */
export default function NotificationSettingsPage() {
  const [state, setState] = useLocalStorage<Prefs>("tk_notif_prefs", {
    orders: true,
    promos: true,
    reels: false,
    reminders: true,
    email: false,
  });

  return (
    <>
      <BackAppBar title="Notifications" fallbackHref="/settings" />
      <Page>
        <Card className="divide-y divide-border">
          {prefs.map((p) => (
            <ListTile
              key={p.key}
              icon={p.icon}
              iconTone={p.tone}
              title={p.title}
              subtitle={p.sub}
              onClick={() => setState({ ...state, [p.key]: !state[p.key] })}
              trailing={
                <Switch
                  checked={state[p.key]}
                  onChange={(v) => setState({ ...state, [p.key]: v })}
                  label={p.title}
                />
              }
            />
          ))}
        </Card>
        <p className="mt-4 px-1 text-xs text-text-muted">
          Push notifications require the mobile app. On the web you&apos;ll see updates in the bell menu.
        </p>
      </Page>
    </>
  );
}
