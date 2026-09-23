"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "./Container";
import { FulfillmentBar } from "./FulfillmentBar";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { notifications, fakeUser } from "@/data/misc";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home" },
  { href: "/reels", label: "Reels" },
  { href: "/orders", label: "Orders" },
  { href: "/favorites", label: "Favorites" },
];

/** Desktop / tablet site header. Hidden on phones where the app bar and bottom nav take over. */
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { isDark, toggle } = useTheme();
  const [q, setQ] = useState("");
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 hidden border-b border-border bg-card/95 backdrop-blur md:block">
      <Link
        href="/home"
        className="absolute start-5 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 md:start-8"
      >
        <Image src="/images/logo/logo_foreground.png" alt="" width={40} height={40} priority />
        <span className="whitespace-nowrap text-lg font-bold text-text">Takos Korner</span>
      </Link>
      <div className="relative mx-auto flex h-[68px] w-full max-w-[1280px] items-center gap-3 px-5 md:px-8">
        {/* Clears the logo until the page column starts to the right of it. */}
        <div
          className="-me-3 w-[max(0px,calc(12rem-max(0px,(100vw-80rem)/2)))] shrink-0"
          aria-hidden
        />
        <FulfillmentBar className="shrink-0" />

        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-primary-bg text-primary" : "text-text-body hover:bg-card-gray",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <form
          className="relative ms-auto hidden min-w-[11rem] w-full max-w-xs flex-1 lg:block"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
          }}
        >
          <Icon
            name="magnifier-outline"
            size={18}
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search restaurants, dishes…"
            className="h-10 w-full rounded-full border border-border bg-bg ps-10 pe-4 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary"
          />
        </form>

        <div className="flex items-center gap-1 lg:ms-0 ms-auto">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-text hover:bg-card-gray lg:hidden"
          >
            <Icon name="magnifier-outline" size={22} />
          </Link>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggle}
            className="grid h-10 w-10 place-items-center rounded-full text-text hover:bg-card-gray"
          >
            <Icon name={isDark ? "sun-outline" : "moon-outline"} size={22} />
          </button>
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
            href="/cart"
            className={cn(
              "relative ms-1 flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold",
              pathname.startsWith("/cart") || pathname.startsWith("/checkout")
                ? "bg-primary text-white"
                : "bg-primary-bg text-primary hover:bg-primary hover:text-white",
            )}
          >
            <Icon name="cart-large-2-bold" size={20} />
            Cart
            {itemCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-primary">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            className="relative ms-1 h-10 w-10 overflow-hidden rounded-full ring-2 ring-border"
          >
            <Image src={fakeUser.avatar} alt="" fill sizes="40px" className="object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 hidden border-t border-border bg-card md:block">
      <Container className="flex flex-col gap-6 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <Image src="/images/logo/logo_foreground.png" alt="" width={36} height={36} />
            <span className="text-base font-bold text-text">Takos Korner</span>
          </div>
          <p className="mt-3 text-sm text-text-muted">
            Order from the best restaurants around you. Fast delivery, live tracking, and dishes
            built your way.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10 text-sm">
          <div>
            <p className="mb-3 font-bold text-text">Explore</p>
            <FooterLink href="/home">Home</FooterLink>
            <FooterLink href="/see-all?kind=restaurants">Restaurants</FooterLink>
            <FooterLink href="/see-all?kind=popular">Popular dishes</FooterLink>
            <FooterLink href="/reels">Reels</FooterLink>
          </div>
          <div>
            <p className="mb-3 font-bold text-text">Account</p>
            <FooterLink href="/orders">Orders</FooterLink>
            <FooterLink href="/favorites">Favorites</FooterLink>
            <FooterLink href="/saved-combos">Saved combos</FooterLink>
            <FooterLink href="/settings">Settings</FooterLink>
          </div>
          <div>
            <p className="mb-3 font-bold text-text">Support</p>
            <FooterLink href="/help">Help center</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </div>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex h-12 items-center justify-between text-xs text-text-muted">
          <span>© {new Date().getFullYear()} Takos Korner Express</span>
          <span>Tunis, Tunisia</span>
        </Container>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="block py-1 text-text-body hover:text-primary">
      {children}
    </Link>
  );
}
