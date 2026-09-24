"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { notifications } from "@/data/misc";

/** Home app bar on phones: logo, name, bell, settings. Mirrors `custom_appbar.dart`. Desktop uses SiteHeader. */
export function AppBar() {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <header className="sticky top-14 z-20 flex h-[60px] items-center gap-2 bg-card px-5 md:hidden">
      <Image
        src="/images/logo/logo_foreground.png"
        alt="Takos Korner"
        width={40}
        height={40}
        loading="eager"
      />
      <span className="text-lg font-bold text-text">Takos Korner</span>
      <span className="flex-1" />
      <Link
        href="/notifications"
        aria-label="Notifications"
        className="relative grid h-10 w-10 place-items-center rounded-full text-text hover:bg-card-gray"
      >
        <Icon name="bell-outline" size={22} />
        {unread > 0 && (
          <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        )}
      </Link>
      <Link
        href="/settings"
        aria-label="Settings"
        className="grid h-10 w-10 place-items-center rounded-full text-text hover:bg-card-gray"
      >
        <Icon name="settings-outline" size={22} />
      </Link>
    </header>
  );
}
