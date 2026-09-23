"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { QtyStepper } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useSnackbar } from "@/context/SnackbarContext";
import type { CartItem } from "@/data/models";
import { customizationSummary, lineTotal, unitTotal } from "@/lib/cart";
import { cn, money } from "@/lib/utils";

/** One cart line: image, name, extras summary, qty stepper, save combo, edit, remove. Mirrors `_CartLine` in `cart_screen.dart`. */
export function CartLine({ item, className }: { item: CartItem; className?: string }) {
  const router = useRouter();
  const cart = useCart();
  const snack = useSnackbar();
  const hasCustom = item.customizations.length > 0;
  const saved = cart.isComboSaved(item);

  return (
    <div className={cn("rounded-card border-[0.5px] border-border bg-card p-3 shadow-card md:p-4", className)}>
      <div className="flex gap-3">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] md:h-24 md:w-24">
          <SafeImage src={item.imageUrl} alt="" fill sizes="96px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text md:text-base">{item.name}</p>
              {item.restaurantName && (
                <p className="truncate text-[11px] text-text-muted">{item.restaurantName}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => cart.removeItem(item.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-muted hover:bg-danger-bg hover:text-danger"
            >
              <Icon name="trash-bin-trash-outline" size={18} />
            </button>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-text-muted">{customizationSummary(item)}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <QtyStepper
              size="sm"
              value={item.quantity}
              onChange={(v) => (v > item.quantity ? cart.incrementItem(item.id) : cart.decrementItem(item.id))}
              min={0}
            />
            <div className="text-end">
              <p className="text-sm font-extrabold text-primary md:text-base">{money(lineTotal(item))}</p>
              {item.quantity > 1 && (
                <p className="text-[10px] text-text-muted">{money(unitTotal(item))} each</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {hasCustom && (
        <div className="mt-3 flex gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => router.push(`/product/${item.productId}/customize?edit=${encodeURIComponent(item.id)}`)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-card-gray py-2 text-xs font-semibold text-text"
          >
            <Icon name="pen-outline" size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              if (saved) {
                cart.removeSavedCombo(item.name, customizationSummary(item));
                snack.show("Combo removed from saved", "info");
              } else {
                cart.saveCombo(item);
                snack.show("Combo saved!", "success");
              }
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[10px] py-2 text-xs font-semibold",
              saved ? "bg-secondary/15 text-secondary" : "bg-card-gray text-text",
            )}
          >
            <Icon name={saved ? "bookmark-bold" : "bookmark-outline"} size={14} />
            {saved ? "Saved" : "Save combo"}
          </button>
        </div>
      )}
    </div>
  );
}
