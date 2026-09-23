"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", label: "Home", outline: "home-2-outline", bold: "home-2-bold" },
  {
    href: "/reels",
    label: "Reels",
    outline: "video-frame-play-horizontal-outline",
    bold: "video-frame-play-horizontal-bold",
  },
  {
    href: "/cart",
    label: "Cart",
    outline: "cart-large-2-outline",
    bold: "cart-large-2-bold",
  },
  { href: "/profile", label: "Profile", outline: "user-outline", bold: "user-bold" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="flex h-[60px] items-stretch">
        {tabs.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors",
                  active ? "text-primary" : "text-text-muted",
                )}
              >
                <span className="relative">
                  <Icon name={active ? t.bold : t.outline} size={24} />
                  {t.href === "/cart" && itemCount > 0 && (
                    <span className="absolute -end-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white ring-2 ring-card">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
