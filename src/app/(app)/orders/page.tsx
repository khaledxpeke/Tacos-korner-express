"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { OrderFilterTabs } from "@/components/orders/OrdersViewToggle";
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

/** One-line live status under the progress bar. Mock ETAs until orders come from the API. */
const statusHint: Partial<Record<OrderStatus, { icon: string; text: string }>> = {
  pending: { icon: "clock-circle-outline", text: "Waiting for the restaurant to accept · ~40 min" },
  preparing: { icon: "chef-hat-outline", text: "The kitchen is preparing your food · arriving in ~25 min" },
  onTheWay: { icon: "scooter-outline", text: "Your courier is on the way · arriving in ~10 min" },
};

/** Mirrors `orders_screen.dart`: Active / Past toggle and order cards. */
export default function OrdersPage() {
  const [view, setView] = useState<View>("active");
  const [openOrder, setOpenOrder] = useState<OrderModel | null>(null);
  const active = orders.filter((o) => activeStatuses.includes(o.status));
  const past = orders.filter((o) => !activeStatuses.includes(o.status));
  const list = view === "active" ? active : past;

  return (
    <>
      <BackAppBar title="My Orders" subtitle="Track current orders and revisit past ones" fallbackHref="/profile" />
      <Page>
        <OrderFilterTabs<View>
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
          <div className={cn("mt-5 gap-4", view === "past" ? "grid md:grid-cols-2" : "flex flex-col")}>
            {list.map((o) => (
              <OrderCard key={o.id} order={o} onDetails={() => setOpenOrder(o)} />
            ))}
          </div>
        )}
      </Page>
      {openOrder && <OrderDetailsModal order={openOrder} onClose={() => setOpenOrder(null)} />}
    </>
  );
}

function OrderCard({ order, onDetails }: { order: OrderModel; onDetails: () => void }) {
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

  const itemCount = order.items.reduce((n, it) => n + it.quantity, 0);
  const summary = order.items.map((it) => (it.quantity > 1 ? `${it.name} ×${it.quantity}` : it.name)).join(", ");
  const hint = statusHint[order.status];

  return (
    <article className="flex flex-col rounded-2xl border-[0.5px] border-border bg-card p-4 shadow-card md:p-5">
      <div className="flex items-start gap-3 md:gap-4">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl md:h-14 md:w-14">
          <SafeImage src={order.restaurantImage} alt="" fill sizes="56px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-extrabold text-text">{order.restaurantName}</h2>
            <Badge tone={statusTone[order.status]}>
              {order.status === "onTheWay" && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" />}
              {orderStatusLabel[order.status]}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-text-muted md:text-sm">
            {order.id} · {order.date}
          </p>
        </div>
        <div className="shrink-0 text-end">
          <p className="text-base font-extrabold text-text md:text-lg">{money(order.total)}</p>
          <p className="text-xs text-text-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 rounded-xl bg-bg p-3 md:p-4">
          <div className="flex gap-1.5">
            {steps.map((s, i) => (
              <span
                key={s}
                className={cn(
                  "h-1.5 flex-1 overflow-hidden rounded-full",
                  i < idx ? "bg-primary" : i === idx ? "bg-primary/30" : "bg-border",
                )}
              >
                {i === idx && <span className="block h-full w-1/2 rounded-full bg-primary" />}
              </span>
            ))}
          </div>
          <div className="mt-2 hidden justify-between text-xs font-semibold text-text-muted sm:flex">
            {steps.map((s, i) => (
              <span key={s} className={i === idx ? "text-primary" : i < idx ? "text-text-body" : undefined}>
                {orderStatusLabel[s]}
              </span>
            ))}
          </div>
          {hint && (
            <p className="mt-2.5 flex items-center gap-2 text-sm font-semibold text-text">
              <Icon name={hint.icon} size={18} className="text-primary" />
              {hint.text}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex shrink-0 -space-x-2 rtl:space-x-reverse">
            {order.items.slice(0, 3).map((it) => (
              <span
                key={it.name}
                className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-card"
              >
                <SafeImage src={it.imageUrl} alt="" fill sizes="32px" className="object-cover" />
              </span>
            ))}
          </span>
          <p className={cn("hidden truncate text-sm text-text-body", isActive ? "sm:block" : "xl:block")}>{summary}</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/help")}
          aria-label="Get help with this order"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-text-muted transition hover:bg-bg hover:text-text"
        >
          <Icon name="question-circle-outline" size={18} />
          <span className="hidden sm:inline">Help</span>
        </button>
        <button
          type="button"
          onClick={onDetails}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-primary px-3.5 text-sm font-bold text-primary transition hover:bg-primary-bg"
        >
          {isActive ? "View details" : "Details"}
        </button>
        {!isActive && (
          <button
            type="button"
            onClick={reorder}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <Icon name="restart-outline" size={16} />
            Reorder
          </button>
        )}
      </div>
    </article>
  );
}
