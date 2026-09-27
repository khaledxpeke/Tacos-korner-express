"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Misc";
import { MAX_ADDRESSES, useAddressBook } from "@/context/AddressBookContext";
import { cn } from "@/lib/utils";

// Orders, favourites and help are reachable from the header, the stats row and Settings, so they are not repeated here.
export function useAccountLinks() {
  const { addresses } = useAddressBook();
  return [
    { href: "/profile", icon: "user-circle-outline", title: "Overview", sub: "Your profile at a glance", exact: true },
    { href: "/settings/edit-profile", icon: "pen-outline", title: "Edit profile", sub: "Name, contact and allergies" },
    { href: "/settings/addresses", icon: "map-point-outline", title: "Addresses", sub: `${addresses.length} of ${MAX_ADDRESSES} saved` },
    { href: "/settings/security", icon: "shield-keyhole-outline", title: "Security", sub: "Password and two-factor sign-in" },
    { href: "/settings/notifications", icon: "bell-outline", title: "Notifications", sub: "Alerts, quiet hours and channels" },
    { href: "/saved-combos", icon: "bookmark-outline", title: "Saved combos", sub: "Your custom builds" },
    { href: "/settings", icon: "settings-outline", title: "Settings", sub: "Language, theme and support", exact: true },
  ];
}

/** Desktop side nav for every account page; highlights the page you are on. */
export function AccountNav() {
  const pathname = usePathname();
  const links = useAccountLinks();

  return (
    <Card className="overflow-hidden p-2">
      <nav aria-label="Account" className="flex flex-col gap-1">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-primary-bg text-primary" : "text-text hover:bg-bg",
              )}
            >
              {active && <span aria-hidden className="absolute inset-y-2 start-0 w-1 rounded-full bg-primary" />}
              <Icon name={l.icon} size={18} className="text-primary" />
              {l.title}
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}

/**
 * Account sub-pages: keeps the side nav beside the page on large screens.
 * The page's own <header> (title) spans the top row above the nav, its <main> sits beside the nav.
 * Pages render their own Containers, so their gutters and max width are flattened inside the grid.
 */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:mx-auto lg:grid lg:w-full lg:max-w-[1280px] lg:grid-cols-[240px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:px-8">
      <aside className="hidden lg:col-start-1 lg:row-start-2 lg:block lg:pt-8">
        <div className="lg:sticky lg:top-[92px]">
          <AccountNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col lg:contents lg:[&_[data-container]]:max-w-none lg:[&_[data-container]]:px-0 lg:[&>header]:col-span-2 lg:[&>header]:row-start-1 lg:[&>main]:col-start-2 lg:[&>main]:row-start-2 lg:[&>main]:min-w-0">
        {children}
      </div>
    </div>
  );
}
