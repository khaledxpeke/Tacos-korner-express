"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { Card, ListTile } from "@/components/ui/Misc";
import { useFavorites } from "@/context/FavoritesContext";
import { fakeUser } from "@/data/misc";
import { orders } from "@/data/orders";

/** Mirrors `profile_screen.dart`: avatar, stats, quick links. */
export default function ProfilePage() {
  const { count } = useFavorites();

  return (
    <>
      <header className="sticky top-0 z-20 bg-card md:static md:bg-transparent">
        <Container className="flex h-[60px] items-center justify-between md:h-auto md:pt-8">
          <h1 className="text-lg font-bold text-text md:text-2xl md:font-extrabold">Profile</h1>
          <Link
            href="/settings"
            aria-label="Settings"
            className="grid h-10 w-10 place-items-center rounded-full text-text hover:bg-card-gray"
          >
            <Icon name="settings-outline" size={22} />
          </Link>
        </Container>
      </header>

      <main className="flex-1">
        <Container className="py-5 md:py-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-primary-dark md:h-28" />
            <div className="-mt-12 flex flex-col items-center px-5 pb-5 md:flex-row md:items-end md:gap-5">
              <span className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-card">
                <Image src={fakeUser.avatar} alt="" fill sizes="96px" className="object-cover" />
              </span>
              <div className="mt-3 text-center md:mb-1 md:flex-1 md:text-start">
                <p className="text-lg font-extrabold text-text md:text-2xl">
                  {fakeUser.firstName} {fakeUser.lastName}
                </p>
                <p className="text-sm text-text-muted">{fakeUser.email}</p>
                <p className="mt-0.5 text-xs text-text-muted md:text-sm">Member since {fakeUser.memberSince}</p>
              </div>
              <Link
                href="/settings/edit-profile"
                className="mt-4 flex items-center gap-1.5 rounded-full bg-primary-bg px-4 py-2 text-xs font-bold text-primary md:mb-1 md:mt-0 md:px-5 md:py-2.5 md:text-sm"
              >
                <Icon name="pen-outline" size={14} />
                Edit profile
              </Link>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
              <Stat value={String(orders.length)} label="Orders" href="/orders" />
              <Stat value={String(count)} label="Favourites" href="/favorites" />
              <Stat value="4.8" label="Rating" />
            </div>
          </Card>

          <Card className="mt-4 flex items-center gap-4 bg-gradient-to-r from-secondary to-secondary-dark p-4 text-white">
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-white/20">
              <Icon name="crown-bold" size={26} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold md:text-base">Korner Points</p>
              <p className="text-xs text-white/80 md:text-sm">{fakeUser.points} pts · 260 to your next free meal</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
                <span className="block h-full w-[82%] rounded-full bg-white" />
              </div>
            </div>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="divide-y divide-border">
              <ListTile icon="bag-4-outline" title="My Orders" subtitle="Track and reorder" href="/orders" />
              <ListTile icon="heart-outline" iconTone="danger" title="Favourites" subtitle="Dishes and restaurants" href="/favorites" />
              <ListTile icon="bookmark-outline" iconTone="amber" title="Saved Combos" subtitle="Your custom builds" href="/saved-combos" />
            </Card>
            <Card className="divide-y divide-border">
              <ListTile icon="bell-outline" iconTone="blue" title="Notifications" href="/notifications" />
              <ListTile icon="settings-outline" iconTone="muted" title="Settings" subtitle="Language, theme, account" href="/settings" />
              <ListTile icon="question-circle-outline" iconTone="green" title="Help & Support" href="/help" />
            </Card>
          </div>
        </Container>
      </main>
    </>
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
