"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { notifications as seed } from "@/data/misc";
import type { NotificationModel } from "@/data/models";
import { cn } from "@/lib/utils";

const meta: Record<NotificationModel["type"], { icon: string; cls: string }> = {
  order: { icon: "bag-4-outline", cls: "bg-blue-bg text-blue" },
  promo: { icon: "ticket-sale-outline", cls: "bg-amber-bg text-amber" },
  system: { icon: "shield-check-outline", cls: "bg-card-gray text-text-muted" },
};

/** Mirrors `notifications_screen.dart`. */
export default function NotificationsPage() {
  const [list, setList] = useState(seed);
  const unread = list.filter((n) => !n.read).length;

  return (
    <>
      <BackAppBar
        title="Notifications"
        subtitle={unread ? `${unread} unread` : "All caught up"}
        trailing={
          unread > 0 ? (
            <button
              type="button"
              onClick={() => setList((l) => l.map((n) => ({ ...n, read: true })))}
              className="text-xs font-semibold text-primary"
            >
              Mark all read
            </button>
          ) : undefined
        }
      />
      <Page>
        {list.length === 0 ? (
          <EmptyCard icon="bell-off-outline" title="No notifications" message="You're all caught up." />
        ) : (
          <ul className="flex flex-col gap-3">
            {list.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setList((l) => l.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-card border-[0.5px] p-4 text-start shadow-card md:gap-4 md:p-5",
                    n.read ? "border-border bg-card" : "border-primary/30 bg-primary-bg/40",
                  )}
                >
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-[12px]", meta[n.type].cls)}>
                    <Icon name={meta[n.type].icon} size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="flex-1 truncate text-sm font-bold text-text md:text-base">{n.title}</span>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className="mt-0.5 block text-xs text-text-body md:text-sm">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-text-muted md:text-xs">{n.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Page>
    </>
  );
}
