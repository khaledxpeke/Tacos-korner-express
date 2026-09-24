"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Container } from "@/components/layout/Container";
import { ReceiptSummaryCard } from "@/components/orders/ReceiptSummaryCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { useCart } from "@/context/CartContext";
import { useFulfillment } from "@/context/FulfillmentContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { fakeUser } from "@/data/misc";
import { cn } from "@/lib/utils";

interface Address {
  label: string;
  line: string;
}

const addresses: Address[] = [
  { label: "Home", line: `${fakeUser.address}, ${fakeUser.city}` },
  { label: "Work", line: "Immeuble Carthage Center, Avenue Habib Bourguiba, Tunis" },
];

type Method = "cash" | "card" | "wallet";

const methods: { id: Method; icon: string; name: string; sub: string }[] = [
  { id: "cash", icon: "banknote-outline", name: "Cash on Delivery", sub: "Pay when your order arrives" },
  { id: "card", icon: "card-outline", name: "Credit / Debit Card", sub: "Visa, Mastercard, Amex" },
  { id: "wallet", icon: "wallet-money-outline", name: "Mobile Wallet", sub: "Apple Pay, Google Pay" },
];

/** Mirrors `payment_screen.dart`. UI only: nothing is charged, the order number is fake. */
export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const snack = useSnackbar();
  const fulfillment = useFulfillment();
  const mode = fulfillment.mode;
  const savedAddresses: Address[] = [
    ...(fulfillment.address.trim()
      ? [{ label: "Deliver to", line: fulfillment.address }]
      : []),
    ...addresses.filter((a) => a.line !== fulfillment.address),
  ];
  const [address, setAddress] = useState<Address | null>(savedAddresses[0] ?? addresses[0]);
  const [method, setMethod] = useState<Method>("cash");

  function placeOrder() {
    if (mode === "delivery" && !address) {
      snack.show("Please choose a delivery address", "error");
      return;
    }
    const orderNumber = `TK-${2000 + cart.items.length * 37 + cart.itemCount}`;
    cart.clearCart();
    router.replace(`/order/success?n=${orderNumber}`);
  }

  if (cart.items.length === 0) {
    return (
      <>
        <BackAppBar title="Checkout" fallbackHref="/cart" />
        <Container className="py-8">
          <div className="mx-auto max-w-md">
            <EmptyCard
              icon="cart-large-2-outline"
              title="Nothing to pay for"
              message="Your cart is empty."
              action={<Button title="Browse Food" onClick={() => router.push("/home")} />}
            />
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <BackAppBar title="Checkout" fallbackHref="/cart" />
      <main className="flex-1">
        <Container className="py-5 md:py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-4">
              {/* Delivery */}
              <section className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
                <p className="text-xs font-bold tracking-wide text-text-muted md:text-sm">
                  {mode === "pickup" ? "Pickup" : "Deliver to"}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Change delivery or pickup in the top bar.
                </p>
                {mode === "pickup" ? (
                  <div className="mt-3 flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-primary-bg text-primary">
                      <Icon name="shop-bold" size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-text md:text-base">Restaurant</p>
                      <p className="text-xs text-text-muted md:text-sm">
                        {cart.items[0]?.restaurantName || "Pick up at the counter"} · ready in 15–20 min
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    {savedAddresses.map((a) => {
                      const on = address?.line === a.line;
                      return (
                        <button
                          key={a.label + a.line}
                          type="button"
                          onClick={() => {
                            setAddress(a);
                            fulfillment.saveAddress(a.line, "delivery");
                          }}
                          className={cn(
                            "flex items-center gap-3 rounded-card border p-3 text-start",
                            on ? "border-primary bg-primary-bg" : "border-border",
                          )}
                        >
                          <Icon
                            name={a.label === "Work" ? "case-outline" : "home-2-outline"}
                            size={20}
                            className="text-primary"
                          />
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-text">{a.label}</span>
                            <span className="block text-xs text-text-muted">{a.line}</span>
                          </span>
                          {on && <Icon name="check-circle-bold" size={20} className="text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Payment method */}
              <section>
                <p className="mb-2 text-xs font-bold tracking-wide text-text-muted md:text-sm">Payment method</p>
                <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-3">
                  {methods.map((m) => {
                    const on = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        aria-pressed={on}
                        className={cn(
                          "flex items-center gap-3 rounded-card border bg-card p-4 text-start shadow-card transition md:p-5",
                          on ? "border-primary" : "border-border",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-11 w-11 shrink-0 place-items-center rounded-[12px]",
                            on ? "bg-primary text-white" : "bg-card-gray text-text-muted",
                          )}
                        >
                          <Icon name={m.icon} size={22} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-bold text-text md:text-base">{m.name}</span>
                          <span className="block text-xs text-text-muted md:mt-0.5 md:text-sm">{m.sub}</span>
                        </span>
                        <span
                          className={cn(
                            "grid h-5 w-5 place-items-center rounded-full border-2",
                            on ? "border-primary bg-primary text-white" : "border-text-muted-light",
                          )}
                        >
                          {on && <Icon name="check-read-outline" size={13} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-text-muted md:text-sm">
                  <Icon name="shield-check-outline" size={14} />
                  Demo checkout — no payment is processed.
                </p>
              </section>

              <div className="lg:hidden">
                <div className="overflow-hidden rounded-card border-[0.5px] border-border shadow-card">
                  <ReceiptSummaryCard onCta={placeOrder} />
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 overflow-hidden rounded-card border-[0.5px] border-border shadow-card">
                <ReceiptSummaryCard onCta={placeOrder} />
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
