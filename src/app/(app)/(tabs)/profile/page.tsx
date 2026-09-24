"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { useFavorites } from "@/context/FavoritesContext";
import { fakeUser } from "@/data/misc";
import { orderStatusLabel, orders } from "@/data/orders";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/orders", icon: "bag-4-outline", title: "Orders", sub: "Track and reorder" },
  { href: "/favorites", icon: "heart-outline", title: "Favourites", sub: "Dishes and restaurants" },
  { href: "/saved-combos", icon: "bookmark-outline", title: "Saved combos", sub: "Your custom builds" },
  { href: "/settings/edit-profile", icon: "map-point-outline", title: "Addresses", sub: "Home and work" },
  { href: "/notifications", icon: "bell-outline", title: "Notifications" },
  { href: "/settings", icon: "settings-outline", title: "Settings", sub: "Language, theme, account" },
  { href: "/help", icon: "question-circle-outline", title: "Help & support" },
];

/** Account overview — website layout with a side nav on desktop. */
export default function ProfilePage() {
  const { count } = useFavorites();
  const recent = orders.slice(0, 2);

  return (
    <main className="flex-1">
      <Container className="py-5 md:py-8">
        <h1 className="text-lg font-bold text-text md:text-3xl md:font-extrabold">Account</h1>

        <div className="mt-5 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <Card className="overflow-hidden p-2">
              {accountLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-text hover:bg-card-gray"
                >
                  <Icon name={l.icon} size={18} className="text-primary" />
                  {l.title}
                </Link>
              ))}
            </Card>
          </aside>

          <div>
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                <span className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-border md:h-24 md:w-24">
                  <Image src={fakeUser.avatar} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <div className="flex-1">
                  <p className="text-lg font-extrabold text-text md:text-2xl">
                    {fakeUser.firstName} {fakeUser.lastName}
                  </p>
                  <p className="text-sm text-text-muted">{fakeUser.email}</p>
                  <p className="mt-0.5 text-xs text-text-muted">Member since {fakeUser.memberSince}</p>
                </div>
                <Link
                  href="/settings/edit-profile"
                  className="inline-flex h-10 items-center gap-1.5 self-start rounded-full bg-primary-bg px-4 text-sm font-bold text-primary"
                >
                  <Icon name="pen-outline" size={14} />
                  Edit profile
                </Link>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                <Stat value={String(orders.length)} label="Orders" href="/orders" />
                <Stat value={String(count)} label="Favourites" href="/favorites" />
                <Stat value={`${fakeUser.points}`} label="Points" />
              </div>
            </Card>

            <Card className="mt-4 flex items-center gap-4 bg-gradient-to-r from-secondary to-secondary-dark p-4 text-white">
              <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-white/20">
                <Icon name="crown-bold" size={26} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold md:text-base">Korner Points</p>
                <p className="text-xs text-white/80 md:text-sm">
                  {fakeUser.points} pts · 260 to your next free meal
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
                  <span className="block h-full w-[82%] rounded-full bg-white" />
                </div>
              </div>
            </Card>

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

            <div className="mt-5 grid gap-2 lg:hidden">
              {accountLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-3 rounded-card border-[0.5px] border-border bg-card px-4 py-3 shadow-card",
                  )}
                >
                  <Icon name={l.icon} size={20} className="text-primary" />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-text">{l.title}</span>
                    {l.sub && <span className="block text-xs text-text-muted">{l.sub}</span>}
                  </span>
                  <Icon name="alt-arrow-right-outline" size={16} className="text-text-muted rtl:rotate-180" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
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
    <Link href={href} className="flex flex-col items-center py-3 hover:bg-card-gray md:py-5">
      {body}
    </Link>
  ) : (
    <div className="flex flex-col items-center py-3 md:py-5">{body}</div>
  );
}
