"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { OrdersViewToggle } from "@/components/orders/OrdersViewToggle";
import { Icon } from "@/components/ui/Icon";
import { Badge, EmptyCard } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useSnackbar } from "@/context/SnackbarContext";
import type { OrderModel, OrderStatus } from "@/data/models";
import { activeStatuses, orderStatusLabel, orders } from "@/data/orders";
import { cartItemsFromOrder } from "@/lib/orders";
import { cn, money } from "@/lib/utils";

type View = "active" | "past";

const statusTone: Record<OrderStatus, "amber" | "blue" | "green" | "danger" | "muted"> = {
  pending: "muted",
  preparing: "amber",
  onTheWay: "blue",
  delivered: "green",
  cancelled: "danger",
};

const steps: OrderStatus[] = ["pending", "preparing", "onTheWay", "delivered"];

/** Mirrors `orders_screen.dart`: Active / Past toggle and order cards. */
export default function OrdersPage() {
  const [view, setView] = useState<View>("active");
  const active = orders.filter((o) => activeStatuses.includes(o.status));
  const past = orders.filter((o) => !activeStatuses.includes(o.status));
  const list = view === "active" ? active : past;

  return (
    <>
      <BackAppBar title="My Orders" fallbackHref="/profile" />
      <Page>
        <OrdersViewToggle<View>
          className="md:max-w-md md:text-sm"
          value={view}
          onChange={setView}
          options={[
            { value: "active", label: "Active", count: active.length },
            { value: "past", label: "Past", count: past.length },
          ]}
        />
        {list.length === 0 ? (
          <EmptyCard
            className="mt-6"
            icon="bag-4-outline"
            title="No orders here yet."
            message={view === "active" ? "Hungry? Your next order will show up here." : "Past orders appear here."}
          />
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {list.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </Page>
    </>
  );
}

function OrderCard({ order }: { order: OrderModel }) {
  const router = useRouter();
  const cart = useCart();
  const snack = useSnackbar();
  const isActive = activeStatuses.includes(order.status);
  const idx = steps.indexOf(order.status);

  function reorder() {
    const lines = cartItemsFromOrder(order);
    if (lines.length === 0 || lines.some((l) => l.price <= 0)) {
      snack.show("This order can't be rebuilt from the current menu", "warning");
      return;
    }
    cart.addItems(lines);
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    snack.show(`${count} items from ${order.restaurantName} added to cart`, "success");
    router.push("/cart");
  }

  return (
    <article className="rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl md:h-16 md:w-16">
              <SafeImage src={order.restaurantImage} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-extrabold text-text md:text-xl">{order.restaurantName}</h2>
                <Badge tone={statusTone[order.status]} className="md:px-3 md:py-1 md:text-xs">
                  {order.status === "onTheWay" && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />}
                  {orderStatusLabel[order.status]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-text-muted">
                {order.id} · {order.date}
              </p>
            </div>
          </div>

          {isActive && (
            <div className="mt-5">
              <div className="flex gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s}
                    className={cn("h-1.5 flex-1 rounded-full", i <= idx ? "bg-primary" : "bg-border")}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs font-semibold text-text-muted md:text-sm">
                {steps.map((s, i) => (
                  <span key={s} className={i === idx ? "text-primary" : undefined}>
                    {orderStatusLabel[s]}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ul className="mt-5 flex flex-col gap-3">
            {order.items.map((it) => (
              <li key={it.name} className="flex items-center gap-3 text-sm md:text-base">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl md:h-12 md:w-12">
                  <SafeImage src={it.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="flex-1 text-text">{it.name}</span>
                <span className="font-semibold text-text-muted">×{it.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 lg:w-56 lg:border-s lg:border-t-0 lg:ps-6 lg:pt-0">
          <div>
            <p className="text-sm text-text-muted">Total</p>
            <p className="text-2xl font-extrabold text-text">{money(order.total)}</p>
          </div>
          {isActive ? (
            <button
              type="button"
              onClick={() =>
                snack.show(
                  `${orderStatusLabel[order.status]} · ${order.restaurantName} is on it`,
                  "info",
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white"
            >
              <Icon name="routing-outline" size={18} />
              Track order
            </button>
          ) : (
            <button
              type="button"
              onClick={reorder}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white"
            >
              <Icon name="restart-outline" size={18} />
              Reorder
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/help")}
            className="flex items-center justify-center gap-2 rounded-xl bg-card-gray py-3 text-sm font-bold text-text"
          >
            <Icon name="question-circle-outline" size={18} />
            Help
          </button>
        </div>
      </div>
    </article>
  );
}
