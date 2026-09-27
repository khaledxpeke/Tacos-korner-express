"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { AccountNav, useAccountLinks } from "@/components/profile/AccountNav";
import { useFavorites } from "@/context/FavoritesContext";
import { fakeUser } from "@/data/misc";
import { orderStatusLabel, orders } from "@/data/orders";

/** Account overview — website layout with a side nav on desktop. */
export default function ProfilePage() {
  const { count } = useFavorites();
  // Phones list every section except the overview they are already on.
  const accountLinks = useAccountLinks().filter((l) => l.href !== "/profile");
  const recent = orders.slice(0, 2);

  return (
    <main className="flex-1">
      <Container className="py-5 md:py-8">
        <h1 className="text-lg font-bold text-text md:text-3xl md:font-extrabold">Account</h1>
        <p className="text-xs text-text-muted md:text-sm">Your profile, rewards and recent orders in one place</p>

        <div className="mt-5 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-[92px] lg:block lg:self-start">
            <AccountNav />
          </aside>

          <div>
            <Card className="overflow-hidden">
              <div className="flex items-center gap-4 p-5">
                <UserAvatar
                  className="h-16 w-16 shrink-0 ring-2 ring-border md:h-24 md:w-24"
                  initialsClass="text-xl md:text-2xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-extrabold text-text md:text-2xl">
                    {fakeUser.firstName} {fakeUser.lastName}
                  </p>
                  <p className="truncate text-sm text-text-muted">{fakeUser.email}</p>
                  <p className="mt-0.5 text-xs text-text-muted">Member since {fakeUser.memberSince}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                <Stat value={String(orders.length)} label="Orders" href="/orders" />
                <Stat value={String(count)} label="Favourites" href="/favorites" />
                <Stat value={`${fakeUser.points}`} label="Points" />
              </div>
            </Card>

            <PointsCard points={fakeUser.points} />

            <div className="mt-5 grid grid-cols-2 gap-3 lg:hidden">
              {accountLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex flex-col gap-2.5 rounded-card border-[0.5px] border-border bg-card p-3.5 shadow-card transition active:scale-[0.98]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-bg text-primary">
                    <Icon name={l.icon} size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-text">{l.title}</span>
                    {l.sub && <span className="block truncate text-[11px] text-text-muted">{l.sub}</span>}
                  </span>
                </Link>
              ))}
            </div>

            <section className="mt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-text">Recent orders</h2>
                <Link href="/orders" className="text-sm font-semibold text-primary">
                  See all
                </Link>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {recent.map((o) => (
                  <Link
                    key={o.id}
                    href="/orders"
                    className="flex items-center gap-3 rounded-card border-[0.5px] border-border bg-card p-3 shadow-card"
                  >
                    <span className="relative h-12 w-12 overflow-hidden rounded-[10px]">
                      <Image src={o.restaurantImage} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-text">{o.restaurantName}</span>
                      <span className="block text-xs text-text-muted">{orderStatusLabel[o.status]}</span>
                    </span>
                    <Icon name="alt-arrow-right-outline" size={16} className="text-text-muted rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}

/** Loyalty card: dark navy with gold accents so it reads as a reward, not another red button. */
function PointsCard({ points }: { points: number }) {
  const goal = 1500;
  const pct = Math.min(100, Math.round((points / goal) * 100));
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl bg-linear-to-br from-[#1a1a2e] via-[#23233d] to-[#2e2a4a] p-4 text-white shadow-card md:p-5 dark:from-[#1e2a44] dark:via-[#26304d] dark:to-[#332d52]">
      <span aria-hidden className="pointer-events-none absolute -end-10 -top-12 h-40 w-40 rounded-full bg-amber/25 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-16 start-1/3 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-linear-to-br from-[#ffd36e] to-amber text-[#5a3b00] shadow-lg shadow-amber/20">
          <Icon name="crown-bold" size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold md:text-base">Korner Points</p>
            <span className="rounded-full border border-amber/40 bg-amber/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#ffd36e] uppercase">
              Gold member
            </span>
          </div>
          <p className="mt-0.5 text-2xl font-extrabold tracking-tight md:text-3xl">
            {points.toLocaleString()} <span className="text-sm font-semibold text-white/60">pts</span>
          </p>
        </div>
      </div>
      <div className="relative mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-white/15">
          <span
            className="block h-full rounded-full bg-linear-to-r from-amber to-[#ffd36e]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-white/70">
          <span>
            <span className="font-bold text-white">{Math.max(0, goal - points)} pts</span> to your next free meal
          </span>
          <Link href="/help" className="font-semibold text-[#ffd36e] hover:underline">
            How it works
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, href }: { value: string; label: string; href?: string }) {
  const body = (
    <>
      <span className="text-lg font-extrabold text-text md:text-2xl">{value}</span>
      <span className="text-[11px] text-text-muted md:text-sm">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="group flex flex-col items-center py-3 transition hover:bg-bg md:py-5">
      {body}
      <span className="mt-0.5 flex items-center gap-0.5 text-[10px] font-semibold text-primary md:text-xs">
        View
        <Icon name="alt-arrow-right-outline" size={11} className="transition group-hover:translate-x-0.5 rtl:rotate-180" />
      </span>
    </Link>
  ) : (
    <div className="flex flex-col items-center py-3 md:py-5">
      {body}
      <span className="mt-0.5 text-[10px] font-semibold text-transparent md:text-xs" aria-hidden>
        ·
      </span>
    </div>
  );
}
