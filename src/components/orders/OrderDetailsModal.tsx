"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/ui/SafeImage";
import { products } from "@/data/home";
import type { OrderModel } from "@/data/models";
import { money } from "@/lib/utils";

function linePrice(name: string) {
  return products.find((p) => p.name === name)?.price;
}

/** Product lines for one order: name, quantity, price, and ingredients. */
export function OrderDetailsModal({
  order,
  onClose,
}: {
  order: OrderModel;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="order-details-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-card p-5 shadow-lg sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">Order details</p>
            <h2 id="order-details-title" className="mt-1 text-xl font-extrabold text-text">
              {order.restaurantName}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {order.id} · {order.date}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center text-text-muted hover:text-text"
          >
            <Icon name="close-outline" size={22} />
          </button>
        </div>

        <ul className="mt-5 flex flex-col gap-4">
          {order.items.map((item) => {
            const price = linePrice(item.name);
            return (
              <li key={item.name} className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <SafeImage src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-extrabold text-text">{item.name}</p>
                    <p className="mt-0.5 text-sm text-text-muted">Quantity {item.quantity}</p>
                  </div>
                  {price != null && (
                    <p className="shrink-0 text-base font-bold text-text">{money(price * item.quantity)}</p>
                  )}
                </div>
                {item.selections && item.selections.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3">
                    {item.selections.map((selection) => (
                      <p key={selection.label} className="text-sm leading-relaxed">
                        <span className="font-bold text-text">{selection.label}:</span>{" "}
                        <span className="text-text-muted">{selection.value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-base font-bold text-text">Total</span>
          <span className="text-xl font-extrabold text-primary">{money(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
