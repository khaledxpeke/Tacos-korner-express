"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartLine } from "@/components/cart/CartLine";
import { Container } from "@/components/layout/Container";
import { ReceiptSummaryCard } from "@/components/orders/ReceiptSummaryCard";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { TextArea } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard, SelectableChip } from "@/components/ui/Misc";
import { useCart } from "@/context/CartContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { money } from "@/lib/utils";

/** Mirrors `cart_screen.dart`. Desktop: lines left, summary right. */
export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const snack = useSnackbar();
  const [confirmClear, setConfirmClear] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const empty = cart.items.length === 0;
  const restaurantCount = new Set(cart.items.map((i) => i.restaurantName)).size;

  function applyCode() {
    if (cart.applyPromoCode(code)) {
      setCodeError(false);
      setCode("");
      snack.show(`Promo "${code.trim().toUpperCase()}" applied!`, "success");
    } else {
      setCodeError(true);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-card md:static md:bg-transparent">
        <Container className="flex h-[60px] items-center justify-between md:h-auto md:pt-8">
          <div>
            <h1 className="text-lg font-bold text-text md:text-2xl md:font-extrabold">My Cart</h1>
            {!empty && (
              <p className="hidden text-sm text-text-muted md:block">
                {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} from{" "}
                {restaurantCount} {restaurantCount === 1 ? "restaurant" : "restaurants"}
              </p>
            )}
          </div>
          {!empty && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1 text-sm font-semibold text-danger"
            >
              <Icon name="trash-bin-trash-outline" size={16} />
              Clear
            </button>
          )}
        </Container>
      </header>

      <main className="flex-1">
        <Container className="py-5 md:py-6">
          {empty ? (
            <div className="mx-auto max-w-md">
              <EmptyCard
                icon="cart-large-2-outline"
                title="Your cart is empty"
                message="Browse restaurants and add items to get started."
                action={<Button title="Browse Food" onClick={() => router.push("/home")} />}
              />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              <div className="flex flex-col gap-3">
                {cart.items.map((i) => (
                  <CartLine key={i.id} item={i} />
                ))}

                <section className="rounded-card border-[0.5px] border-border bg-card p-3 shadow-card md:rounded-2xl md:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                    <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-bg text-primary md:grid">
                      <Icon name="ticket-sale-outline" size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-bold text-text md:text-base md:font-extrabold">Promo code</h2>
                      <p className="mt-0.5 hidden text-sm text-text-muted md:block">
                        {cart.promoCode
                          ? `${cart.promoCode} is applied to this order.`
                          : "Enter a code, or pick one of the offers."}
                      </p>
                    </div>
                    {cart.promoCode ? (
                      <div className="flex items-center justify-between gap-4 rounded-xl bg-green-bg px-4 py-3 lg:min-w-[280px]">
                        <span className="text-sm font-bold text-green">
                          −{money(cart.discount)} saved
                        </span>
                        <button
                          type="button"
                          onClick={cart.removePromoCode}
                          className="text-sm font-semibold text-danger"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form
                        className="flex w-full lg:w-[360px]"
                        onSubmit={(e) => {
                          e.preventDefault();
                          applyCode();
                        }}
                      >
                        <input
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value.toUpperCase());
                            setCodeError(false);
                          }}
                          placeholder="TACO10"
                          aria-label="Promo code"
                          className="h-10 min-w-0 flex-1 rounded-s-xl border border-e-0 border-border bg-bg px-3 text-sm font-semibold tracking-wide text-text uppercase outline-none placeholder:font-normal placeholder:normal-case placeholder:text-text-muted focus:border-primary md:h-12 md:px-4"
                        />
                        <button
                          type="submit"
                          className="h-10 shrink-0 rounded-e-xl bg-primary px-4 text-sm font-bold text-white md:h-12 md:px-5"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>
                  {codeError && (
                    <p className="mt-3 text-sm font-medium text-danger">
                      That code is not valid. Try TACO10 or WELCOME.
                    </p>
                  )}
                  {!cart.promoCode && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        { code: "TACO10", label: "10% off" },
                        { code: "WELCOME", label: "$3 off" },
                      ].map((offer) => (
                        <button
                          key={offer.code}
                          type="button"
                          onClick={() => {
                            setCode(offer.code);
                            setCodeError(false);
                          }}
                          className="rounded-full border border-border bg-bg px-2.5 py-1 text-xs text-text hover:border-primary md:px-3 md:py-1.5 md:text-sm"
                        >
                          <span className="font-bold">{offer.code}</span>
                          <span className="text-text-muted"> · {offer.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
                  <p className="text-sm font-bold text-text md:text-base">Tip for your courier</p>
                  <p className="text-xs text-text-muted md:text-sm">Goes entirely to your delivery person</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[0, 5, 10, 15].map((p) => (
                      <SelectableChip
                        key={p}
                        label={p === 0 ? "No tip" : `${p}%`}
                        selected={cart.tipPercent === p}
                        onClick={() => cart.setTipPercent(p)}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
                  <p className="flex items-center gap-2 text-sm font-bold text-text md:text-base">
                    <Icon name="notes-outline" size={17} className="text-text-muted" />
                    Special instructions
                  </p>
                  <TextArea
                    className="mt-3"
                    placeholder="Allergies, no onions, extra napkins…"
                    value={cart.note}
                    onChange={(e) => cart.setNote(e.target.value)}
                  />
                </div>
                </div>
              </div>

              {/* Summary */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 overflow-hidden rounded-card border-[0.5px] border-border shadow-card">
                  <ReceiptSummaryCard
                    ctaTitle="Proceed to Checkout"
                    ctaIcon="alt-arrow-right-outline"
                    onCta={() => router.push("/checkout")}
                  />
                </div>
              </aside>
            </div>
          )}
        </Container>
      </main>

      {/* Phone / tablet checkout bar */}
      {!empty && (
        <div className="sticky bottom-0 z-20 border-t border-border bg-card pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
          <Container className="flex items-center gap-4">
            <div>
              <p className="text-[11px] text-text-muted">Total</p>
              <p className="text-lg font-extrabold text-text">{money(cart.total)}</p>
            </div>
            <Button
              title="Proceed to Checkout"
              icon="alt-arrow-right-outline"
              iconRight
              className="flex-1"
              onClick={() => router.push("/checkout")}
            />
          </Container>
        </div>
      )}

      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear cart"
        message="Remove all items from your cart?"
        confirmText="Clear"
        danger
        onConfirm={cart.clearCart}
      />
    </>
  );
}
