"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Container } from "@/components/layout/Container";
import { ReceiptSummaryCard } from "@/components/orders/ReceiptSummaryCard";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { useCart } from "@/context/CartContext";
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
type Mode = "delivery" | "pickup";

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
  const [mode, setMode] = useState<Mode>("delivery");
  const [address, setAddress] = useState<Address | null>(addresses[0]);
  const [method, setMethod] = useState<Method>("cash");
  const [picker, setPicker] = useState(false);

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
        <BackAppBar title="Payment" fallbackHref="/cart" />
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
      <BackAppBar title="Payment" fallbackHref="/cart" />
      <main className="flex-1">
        <Container className="py-5 md:py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-4">
              {/* Delivery */}
              <section className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-wide text-text-muted md:text-sm">Delivery</p>
                  {mode === "delivery" && (
                    <button
                      type="button"
                      onClick={() => setPicker(true)}
                      className="text-xs font-semibold text-primary"
                    >
                      {address ? "Change" : "Add address"}
                    </button>
                  )}
                </div>
                <div className="mt-3 flex rounded-[14px] bg-card-gray p-1">
                  {(
                    [
                      { v: "delivery", icon: "delivery-outline", label: "Delivery" },
                      { v: "pickup", icon: "shop-bold", label: "Pickup" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setMode(o.v)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-[11px] py-2 text-xs font-bold md:py-2.5 md:text-sm",
                        mode === o.v ? "bg-card text-primary shadow-card" : "text-text-muted",
                      )}
                    >
                      <Icon name={o.icon} size={16} />
                      {o.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-primary-bg text-primary">
                    <Icon name={mode === "delivery" ? "map-point-bold" : "shop-bold"} size={20} />
                  </span>
                  {mode === "pickup" ? (
                    <div>
                      <p className="text-sm font-bold text-text md:text-base">Restaurant</p>
                      <p className="text-xs text-text-muted md:text-sm">
                        {cart.items[0]?.restaurantName || "Pick up at the counter"} · ready in 15–20 min
                      </p>
                    </div>
                  ) : address ? (
                    <div>
                      <p className="text-sm font-bold text-text md:text-base">{address.label}</p>
                      <p className="text-xs text-text-muted md:text-sm">{address.line}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">Add a delivery address</p>
                  )}
                </div>
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

      <BottomSheet open={picker} onClose={() => setPicker(false)} title="Deliver to">
        <div className="flex flex-col gap-2 px-5">
          {addresses.map((a) => {
            const on = address?.label === a.label;
            return (
              <button
                key={a.label}
                type="button"
                onClick={() => {
                  setAddress(a);
                  setPicker(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-card border p-3 text-start",
                  on ? "border-primary bg-primary-bg" : "border-border",
                )}
              >
                <Icon name={a.label === "Home" ? "home-2-outline" : "case-outline"} size={20} className="text-primary" />
                <span className="flex-1">
                  <span className="block text-sm font-bold text-text">{a.label}</span>
                  <span className="block text-xs text-text-muted">{a.line}</span>
                </span>
                {on && <Icon name="check-circle-bold" size={20} className="text-primary" />}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setAddress({ label: "Current Location", line: "Avenue de la Liberté, Tunis (approx.)" });
              setPicker(false);
            }}
            className="mt-2 flex items-center justify-center gap-2 rounded-[12px] bg-card-gray py-3 text-xs font-bold text-text"
          >
            <Icon name="gps-outline" size={16} />
            USE MY CURRENT LOCATION
          </button>
          <Button
            title="Add new address"
            isTransparent
            icon="add-circle-bold"
            onClick={() => {
              setPicker(false);
              router.push("/settings/edit-profile#address");
            }}
          />
        </div>
      </BottomSheet>
    </>
  );
}
