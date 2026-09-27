"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Container } from "@/components/layout/Container";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { ReceiptSummaryCard } from "@/components/orders/ReceiptSummaryCard";
import { AddAddressPanel } from "@/components/address/AddAddressPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { useCart } from "@/context/CartContext";
import { useFulfillment } from "@/context/FulfillmentContext";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  MAX_ADDRESSES,
  addressTypeIcon,
  addressTypes,
  formatAddress,
  repeatableType,
  useAddressBook,
} from "@/context/AddressBookContext";
import { cn } from "@/lib/utils";

interface Address {
  label: string;
  line: string;
  icon: string;
}

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
  const currentLine = fulfillment.address.trim();
  const book = useAddressBook();
  const [adding, setAdding] = useState(false);
  const [method, setMethod] = useState<Method>("cash");
  // Keeps the page (not the empty-cart state) on screen while navigating to the success page.
  const [placed, setPlaced] = useState(false);

  const bookAddresses: Address[] = book.addresses.map((a) => ({
    label: a.type,
    line: formatAddress(a),
    icon: addressTypeIcon(a.type),
  }));
  // An address typed in the header that is not in the address book still shows, unsaved.
  const savedAddresses: Address[] =
    currentLine && !bookAddresses.some((a) => a.line === currentLine)
      ? [{ label: "Current address", line: currentLine, icon: "gps-outline" }, ...bookAddresses]
      : bookAddresses;

  function selectAddress(a: Address) {
    fulfillment.saveAddress(a.line, "delivery");
  }

  function addAddress(raw: string) {
    const line = raw.trim();
    if (line.length < 4) {
      snack.show("Enter a street or neighborhood", "error");
      return;
    }
    const existing = bookAddresses.find((a) => a.line.toLowerCase() === line.toLowerCase());
    if (!existing) {
      const taken = book.takenTypes();
      const type = addressTypes.find((t) => !taken.includes(t.label))?.label ?? repeatableType;
      book.add({ type, street: line, city: "", postalCode: "", notes: "" });
    }
    fulfillment.saveAddress(line, "delivery");
    setAdding(false);
  }

  function canPlaceOrder() {
    if (mode === "delivery" && !currentLine) {
      snack.show("Please choose a delivery address", "error");
      return false;
    }
    return true;
  }

  function placeOrder() {
    setPlaced(true);
    const orderNumber = `TK-${2000 + cart.items.length * 37 + cart.itemCount}`;
    cart.clearCart();
    router.replace(`/order/success?n=${orderNumber}`);
  }

  const placeOrderButton = (
    <CheckoutButton
      title="Place Order"
      icon="check-circle-bold"
      doneLabel="Order placed!"
      doneIcon="check-circle-bold"
      canGo={canPlaceOrder}
      onGo={placeOrder}
    />
  );

  if (cart.items.length === 0 && !placed) {
    return (
      <>
        <BackAppBar title="Checkout" subtitle="Confirm delivery, payment and your order" fallbackHref="/cart" />
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
      <BackAppBar title="Checkout" subtitle="Confirm delivery, payment and your order" fallbackHref="/cart" />
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
                      const on = a.line === currentLine;
                      return (
                        <button
                          key={a.label + a.line}
                          type="button"
                          aria-pressed={on}
                          onClick={() => selectAddress(a)}
                          className={cn(
                            "flex items-center gap-3 rounded-card border p-3 text-start",
                            on ? "border-primary bg-primary-bg" : "border-border",
                          )}
                        >
                          <Icon name={a.icon} size={20} className="text-primary" />
                          <span className="flex-1">
                            <span className="block text-sm font-bold text-text">{a.label}</span>
                            <span className="block text-xs text-text-muted">{a.line}</span>
                          </span>
                          {on && <Icon name="check-circle-bold" size={20} className="text-primary" />}
                        </button>
                      );
                    })}
                    {adding ? (
                      <AddAddressPanel onSave={addAddress} onCancel={() => setAdding(false)} />
                    ) : book.isFull ? (
                      <p className="flex items-center justify-between gap-3 rounded-card bg-bg px-3 py-2.5 text-xs text-text-muted">
                        <span>You have saved {MAX_ADDRESSES} of {MAX_ADDRESSES} addresses.</span>
                        <Link href="/settings/addresses" className="font-bold text-primary hover:underline">
                          Manage
                        </Link>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAdding(true)}
                        className="flex items-center justify-center gap-2 rounded-card border border-dashed border-border py-3 text-sm font-semibold text-text-body transition hover:border-primary/40 hover:text-primary"
                      >
                        <Icon name="add-circle-outline" size={18} />
                        Add new address
                      </button>
                    )}
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
                          <span className="block whitespace-nowrap text-[13px] font-bold leading-tight text-text">{m.name}</span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-text-muted">{m.sub}</span>
                        </span>
                        <span
                          className={cn(
                            "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
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
                  <ReceiptSummaryCard cta={placeOrderButton} />
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 overflow-hidden rounded-card border-[0.5px] border-border shadow-card">
                <ReceiptSummaryCard cta={placeOrderButton} />
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
