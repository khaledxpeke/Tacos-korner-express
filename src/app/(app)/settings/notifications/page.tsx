"use client";

import type { ReactNode } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Switch } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn } from "@/lib/utils";

type Tone = "blue" | "amber" | "purple" | "green" | "primary" | "muted";

const tones: Record<Tone, string> = {
  blue: "bg-blue-bg text-blue",
  amber: "bg-amber-bg text-amber",
  purple: "bg-purple-bg text-purple",
  green: "bg-green-bg text-green",
  primary: "bg-primary-bg text-primary",
  muted: "bg-bg text-text-muted",
};

const categoryGroups = [
  {
    title: "Orders & delivery",
    items: [
      { key: "orderStatus", icon: "bag-4-outline", tone: "blue", title: "Order status", sub: "Accepted, preparing, ready, delivered", locked: true },
      { key: "courier", icon: "chat-dots-outline", tone: "blue", title: "Courier messages", sub: "When your courier needs to reach you" },
      { key: "arriving", icon: "scooter-outline", tone: "blue", title: "Delivery arriving", sub: "A heads-up a few minutes before" },
    ],
  },
  {
    title: "Offers & rewards",
    items: [
      { key: "promos", icon: "ticket-sale-outline", tone: "amber", title: "Promotions & deals", sub: "Promo codes and weekend offers" },
      { key: "points", icon: "crown-minimalistic-bold", tone: "amber", title: "Korner Points", sub: "Points earned and free meals unlocked" },
      { key: "newRestaurants", icon: "shop-2-outline", tone: "amber", title: "New near you", sub: "Kitchens that just opened in your area" },
    ],
  },
  {
    title: "Activity",
    items: [
      { key: "reels", icon: "video-frame-play-horizontal-outline", tone: "purple", title: "Reels & new dishes", sub: "When restaurants you like post" },
      { key: "mealReminders", icon: "alarm-outline", tone: "purple", title: "Meal-time reminders", sub: "A nudge at lunch and dinner time" },
      { key: "reviewReminders", icon: "star-outline", tone: "purple", title: "Rate your order", sub: "Ask for a review after delivery" },
    ],
  },
] as const;

type CategoryKey = (typeof categoryGroups)[number]["items"][number]["key"];

const channels = [
  { key: "push", icon: "smartphone-outline", title: "Push", sub: "On this device" },
  { key: "email", icon: "letter-outline", title: "Email", sub: "Receipts and weekly digest" },
  { key: "sms", icon: "chat-round-line-outline", title: "SMS", sub: "Only for delivery updates" },
] as const;

type ChannelKey = (typeof channels)[number]["key"];
type PauseKey = "off" | "1h" | "8h" | "tomorrow";
type QuietDays = "every" | "weekdays" | "weekends";

interface NotifPrefs {
  enabled: boolean;
  pause: PauseKey;
  pausedUntil: number | null;
  quiet: { on: boolean; from: string; to: string; days: QuietDays };
  categories: Record<CategoryKey, boolean>;
  channels: Record<ChannelKey, boolean>;
  sound: boolean;
  vibration: boolean;
}

const defaults: NotifPrefs = {
  enabled: true,
  pause: "off",
  pausedUntil: null,
  quiet: { on: false, from: "22:00", to: "08:00", days: "every" },
  categories: {
    orderStatus: true,
    courier: true,
    arriving: true,
    promos: true,
    points: true,
    newRestaurants: false,
    reels: false,
    mealReminders: true,
    reviewReminders: true,
  },
  channels: { push: true, email: true, sms: false },
  sound: true,
  vibration: true,
};

/** Accepts the older five-toggle shape saved under the same key. */
function normalize(raw: unknown): NotifPrefs {
  const r = (raw ?? {}) as Partial<NotifPrefs> & Record<string, unknown>;
  if (typeof r.enabled !== "boolean") {
    const bool = (k: string, d: boolean) => (typeof r[k] === "boolean" ? (r[k] as boolean) : d);
    return {
      ...defaults,
      categories: {
        ...defaults.categories,
        promos: bool("promos", defaults.categories.promos),
        reels: bool("reels", defaults.categories.reels),
        mealReminders: bool("reminders", defaults.categories.mealReminders),
      },
      channels: { ...defaults.channels, email: bool("email", defaults.channels.email) },
    };
  }
  return {
    ...defaults,
    ...r,
    quiet: { ...defaults.quiet, ...r.quiet },
    categories: { ...defaults.categories, ...r.categories, orderStatus: true },
    channels: { ...defaults.channels, ...r.channels },
  };
}

const pauses: { key: PauseKey; label: string }[] = [
  { key: "off", label: "Off" },
  { key: "1h", label: "1 hour" },
  { key: "8h", label: "8 hours" },
  { key: "tomorrow", label: "Until tomorrow" },
];

function pauseUntil(key: PauseKey): number | null {
  const now = new Date();
  if (key === "1h") return now.getTime() + 60 * 60 * 1000;
  if (key === "8h") return now.getTime() + 8 * 60 * 60 * 1000;
  if (key === "tomorrow") {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    t.setHours(8, 0, 0, 0);
    return t.getTime();
  }
  return null;
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const times = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 ? "30" : "00"}`;
});

/** Notification preferences: master switch, pause, quiet hours, categories, channels, sound. */
export default function NotificationSettingsPage() {
  const [raw, setRaw] = useLocalStorage<unknown>("tk_notif_prefs", defaults);
  const prefs = normalize(raw);
  const set = (patch: Partial<NotifPrefs>) => setRaw({ ...prefs, ...patch });
  const off = !prefs.enabled;
  const paused = prefs.enabled && prefs.pause !== "off" && prefs.pausedUntil != null;

  const status = off
    ? { icon: "bell-off-outline", tone: "muted" as Tone, title: "Notifications are off", sub: "You won't get any alerts, including order updates." }
    : paused
      ? { icon: "pause-circle-outline", tone: "amber" as Tone, title: `Paused until ${formatTime(prefs.pausedUntil!)}`, sub: "Order status updates still come through." }
      : { icon: "bell-bing-outline", tone: "green" as Tone, title: "Notifications are on", sub: "We'll only send what you choose below." };

  return (
    <>
      <BackAppBar title="Notifications" subtitle="Choose what reaches you, and when" fallbackHref="/profile" />
      <Page>
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          {/* Master */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card md:p-5">
            <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", tones[status.tone])}>
              <Icon name={status.icon} size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-text md:text-base">{status.title}</p>
              <p className="text-xs text-text-muted md:text-sm">{status.sub}</p>
            </div>
            <Switch
              checked={prefs.enabled}
              onChange={(v) => set({ enabled: v })}
              label="Allow notifications"
            />
          </div>

          <div className={cn("grid gap-5 md:grid-cols-2", off && "pointer-events-none opacity-50")} aria-disabled={off}>
            <div className="flex flex-col gap-5">
              <Group title="Pause & quiet hours" hint="Silence everything for a while, or on a schedule.">
                <div className="px-4 py-4 md:px-5">
                  <div className="flex items-center gap-3">
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", tones.amber)}>
                      <Icon name="pause-circle-outline" size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-text">Pause for</span>
                      <span className="block text-xs text-text-muted">
                        {paused ? `Until ${formatTime(prefs.pausedUntil!)}` : "Not paused"}
                      </span>
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pauses.map((p) => {
                      const on = prefs.pause === p.key;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          aria-pressed={on}
                          onClick={() => set({ pause: p.key, pausedUntil: pauseUntil(p.key) })}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-bold transition md:text-sm",
                            on
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-card text-text-body hover:border-primary/40 hover:text-text",
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <ToggleRow
                  icon="moon-sleep-outline"
                  tone="purple"
                  title="Scheduled quiet hours"
                  sub={prefs.quiet.on ? `${prefs.quiet.from} – ${prefs.quiet.to}` : "Off"}
                  checked={prefs.quiet.on}
                  onChange={(v) => set({ quiet: { ...prefs.quiet, on: v } })}
                />
                {prefs.quiet.on && (
                  <div className="flex flex-col gap-4 px-4 py-4 md:px-5">
                    <div className="grid grid-cols-2 gap-3">
                      <TimeSelect
                        label="From"
                        value={prefs.quiet.from}
                        onChange={(from) => set({ quiet: { ...prefs.quiet, from } })}
                      />
                      <TimeSelect
                        label="To"
                        value={prefs.quiet.to}
                        onChange={(to) => set({ quiet: { ...prefs.quiet, to } })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1 rounded-full border border-border bg-bg p-1">
                      {(
                        [
                          { v: "every", label: "Every day" },
                          { v: "weekdays", label: "Weekdays" },
                          { v: "weekends", label: "Weekends" },
                        ] as const
                      ).map((d) => (
                        <button
                          key={d.v}
                          type="button"
                          aria-pressed={prefs.quiet.days === d.v}
                          onClick={() => set({ quiet: { ...prefs.quiet, days: d.v } })}
                          className={cn(
                            "rounded-full py-1.5 text-xs font-bold transition",
                            prefs.quiet.days === d.v ? "bg-primary text-white shadow-sm" : "text-text-body hover:text-text",
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="flex items-center gap-1.5 px-4 py-3 text-xs text-text-muted md:px-5">
                  <Icon name="info-circle-outline" size={14} />
                  Order status updates always come through.
                </p>
              </Group>

              <Group title="Channels">
                {channels.map((c) => (
                  <ToggleRow
                    key={c.key}
                    icon={c.icon}
                    tone="muted"
                    title={c.title}
                    sub={c.sub}
                    checked={prefs.channels[c.key]}
                    onChange={(v) => set({ channels: { ...prefs.channels, [c.key]: v } })}
                  />
                ))}
              </Group>

              <Group title="Sound & vibration">
                <ToggleRow
                  icon="volume-loud-outline"
                  tone="muted"
                  title="Sound"
                  sub="Play a sound for new alerts"
                  checked={prefs.sound}
                  onChange={(v) => set({ sound: v })}
                />
                <ToggleRow
                  icon="smartphone-vibration-outline"
                  tone="muted"
                  title="Vibration"
                  sub="On supported phones"
                  checked={prefs.vibration}
                  onChange={(v) => set({ vibration: v })}
                />
              </Group>
            </div>

            <div className="flex flex-col gap-5">
              {categoryGroups.map((g) => (
                <Group key={g.title} title={g.title}>
                  {g.items.map((it) => {
                    const locked = "locked" in it && it.locked;
                    return (
                      <ToggleRow
                        key={it.key}
                        icon={it.icon}
                        tone={it.tone}
                        title={it.title}
                        sub={locked ? `${it.sub} · always on` : it.sub}
                        checked={prefs.categories[it.key]}
                        disabled={locked}
                        onChange={(v) => set({ categories: { ...prefs.categories, [it.key]: v } })}
                      />
                    );
                  })}
                </Group>
              ))}
            </div>
          </div>

          <p className="px-1 text-xs text-text-muted">
            Push notifications need the mobile app. On the web you&apos;ll see updates in the bell menu.
          </p>
        </div>
      </Page>
    </>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-2 px-1">
        <h2 className="text-sm font-extrabold text-text">{title}</h2>
        {hint && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-card">{children}</div>
    </section>
  );
}

function ToggleRow({
  icon,
  tone,
  title,
  sub,
  checked,
  disabled,
  onChange,
}: {
  icon: string;
  tone: Tone;
  title: string;
  sub?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 md:px-5">
      <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text">{title}</span>
        {sub && <span className="block text-xs text-text-muted">{sub}</span>}
      </span>
      <Switch checked={checked} onChange={onChange} disabled={disabled} label={title} />
    </div>
  );
}

function TimeSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-text-body">{label}</span>
      <span className="relative block">
        <Icon
          name="clock-circle-outline"
          size={16}
          className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-[12px] border border-border bg-card ps-9 pe-8 text-sm font-semibold text-text outline-none transition focus:border-amber focus:ring-2 focus:ring-amber/25"
        >
          {times.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <Icon
          name="alt-arrow-down-outline"
          size={16}
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </span>
    </label>
  );
}
