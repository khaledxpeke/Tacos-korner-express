"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useSnackbar } from "@/context/SnackbarContext";
import type { CartItem } from "@/data/models";
import { customizationSummary, unitTotal } from "@/lib/cart";
import { money } from "@/lib/utils";

/** Mirrors `saved_combos_screen.dart`. */
export default function SavedCombosPage() {
  const router = useRouter();
  const cart = useCart();
  const snack = useSnackbar();
  const [toRemove, setToRemove] = useState<CartItem | null>(null);

  return (
    <>
      <BackAppBar title="Saved Combos" fallbackHref="/profile" />
      <Page>
        {cart.savedCombos.length === 0 ? (
          <div className="mx-auto max-w-md">
            <EmptyCard
              icon="bookmark-outline"
              title="No saved combos yet."
              message="Save a customized order from your cart to reorder it quickly."
              action={<Button title="Browse Food" onClick={() => router.push("/home")} />}
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cart.savedCombos.map((c) => (
              <article
                key={c.id}
                className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card md:p-5"
              >
                <div className="flex gap-3">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] md:h-20 md:w-20">
                    <SafeImage src={c.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-text md:text-lg">{c.name}</p>
                    <p className="truncate text-[11px] text-text-muted md:text-sm">{c.restaurantName}</p>
                    <p className="mt-1 text-base font-extrabold text-primary md:text-xl">{money(unitTotal(c))}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove saved combo"
                    onClick={() => setToRemove(c)}
                    className="grid h-8 w-8 place-items-center rounded-full text-text-muted hover:bg-danger-bg hover:text-danger"
                  >
                    <Icon name="trash-bin-trash-outline" size={18} />
                  </button>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {c.customizations.flatMap((cu) =>
                    cu.selected.map((o) => (
                      <li
                        key={`${cu.typeId}-${o.id}`}
                        className="rounded-full bg-card-gray px-2.5 py-0.5 text-[11px] font-medium text-text-body md:text-xs"
                      >
                        {o.name}
                      </li>
                    )),
                  )}
                </ul>
                <Button
                  title="Reorder"
                  icon="cart-large-2-bold"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    cart.addSavedComboToCart(c);
                    snack.show(`${c.name} added to cart`, "success");
                  }}
                />
              </article>
            ))}
          </div>
        )}
      </Page>
      <Dialog
        open={!!toRemove}
        onClose={() => setToRemove(null)}
        title="Remove Saved Combo"
        message={toRemove ? `Remove "${toRemove.name}" from your saved combos?` : undefined}
        confirmText="Remove"
        danger
        onConfirm={() => toRemove && cart.removeSavedCombo(toRemove.name, customizationSummary(toRemove))}
      />
    </>
  );
}
