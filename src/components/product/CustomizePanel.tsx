"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { QtyStepper } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { restaurantOf } from "@/data/home";
import type { CartCustomization, IngredientModel, ProductModel, ProductTypeModel } from "@/data/models";
import { cn, money } from "@/lib/utils";

/** Build-your-own panel on the restaurant menu so the user never leaves the kitchen. */
export function CustomizePanel({
  product,
  onClose,
}: {
  product: ProductModel;
  onClose: () => void;
}) {
  const cart = useCart();
  const snack = useSnackbar();
  const restaurant = restaurantOf(product);
  const [selection, setSelection] = useState<Record<string, IngredientModel[]>>(() => {
    const s: Record<string, IngredientModel[]> = {};
    for (const t of product.types) s[t.id] = [];
    return s;
  });
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const extras = useMemo(
    () => Object.values(selection).flat().reduce((sum, i) => sum + i.price, 0),
    [selection],
  );
  const grandTotal = (product.price + extras) * qty;
  const isValid = product.types.every((t) => (selection[t.id]?.length ?? 0) >= t.min);

  function toggle(type: ProductTypeModel, option: IngredientModel) {
    setSelection((prev) => {
      const current = prev[type.id] ?? [];
      const has = current.some((o) => o.id === option.id);
      if (type.max === 1) return { ...prev, [type.id]: has ? [] : [option] };
      if (has) return { ...prev, [type.id]: current.filter((o) => o.id !== option.id) };
      if (current.length >= type.max) {
        snack.show(`You can only pick ${type.max} from "${type.name}"`, "warning");
        return prev;
      }
      return { ...prev, [type.id]: [...current, option] };
    });
  }

  function add() {
    if (!isValid) {
      snack.show("Please complete all required selections", "error");
      return;
    }
    const customizations: CartCustomization[] = product.types
      .filter((t) => (selection[t.id]?.length ?? 0) > 0)
      .map((t) => ({ typeId: t.id, typeName: t.name, selected: selection[t.id] }));
    cart.addItem({
      id: `${product.name}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      description: note.trim() || product.description,
      price: product.price,
      imageUrl: product.image,
      restaurantName: restaurant.name,
      quantity: qty,
      customizations,
    });
    snack.show(`${product.name} added to cart`, "success");
    onClose();
  }

  if (!ready) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[24px] bg-card shadow-lg md:max-h-[min(88vh,800px)] md:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px]">
              <SafeImage src={product.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-text">{product.name}</p>
              <p className="text-sm font-semibold text-primary">{money(product.price)}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-card-gray text-text"
          >
            <Icon name="close-circle-bold" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl">
            <SafeImage src={product.image} alt="" fill sizes="512px" className="object-cover" />
          </div>
          <p className="text-sm text-text-muted">{restaurant.name}</p>
          <p className="mt-1 text-sm text-text-body">{product.description}</p>
          {product.allergens.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.allergens.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 rounded-full bg-warning-bg px-3 py-1 text-xs font-semibold text-warning"
                >
                  <Icon name="danger-triangle-bold" size={12} />
                  {a}
                </span>
              ))}
            </div>
          )}
          {product.types.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              {product.types.map((t) => (
                <OptionGroup key={t.id} type={t} selected={selection[t.id] ?? []} onToggle={(o) => toggle(t, o)} />
              ))}
            </div>
          )}
          <div className="mt-4">
            <TextArea
              label="Special instructions (optional)"
              placeholder="No onions, extra napkins…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={140}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <QtyStepper value={qty} onChange={setQty} />
          <Button
            title={`Add · ${money(grandTotal)}`}
            icon="cart-large-2-bold"
            isDisabled={!isValid}
            onClick={add}
            className="flex-1"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function OptionGroup({
  type,
  selected,
  onToggle,
}: {
  type: ProductTypeModel;
  selected: IngredientModel[];
  onToggle: (o: IngredientModel) => void;
}) {
  const count = selected.length;
  const required = type.min > 0;
  const fulfilled = !required || count >= type.min;
  const single = type.max === 1;

  return (
    <section className="rounded-card border-[0.5px] border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-text">{type.name}</h3>
          <p className="text-xs text-text-muted">{type.message}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            required
              ? fulfilled
                ? "bg-green-bg text-green"
                : "bg-danger-bg text-danger"
              : "bg-card-gray text-text-muted",
          )}
        >
          {required ? (fulfilled ? "Done" : "Required") : "Optional"}
        </span>
      </div>
      <ul className="mt-3 grid gap-2">
        {type.options.map((o) => {
          const isSelected = selected.some((s) => s.id === o.id);
          const disabled = !isSelected && !single && count >= type.max;
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => onToggle(o)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-start transition",
                  isSelected ? "border-primary bg-primary-bg" : "border-border bg-card hover:border-text-muted-light",
                  disabled && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center border-2",
                    single ? "rounded-full" : "rounded-md",
                    isSelected ? "border-primary bg-primary text-white" : "border-text-muted-light",
                  )}
                >
                  {isSelected && <Icon name="check-read-outline" size={14} />}
                </span>
                <span className="flex-1 text-sm font-medium text-text">{o.name}</span>
                <span className={cn("text-xs font-semibold", o.price > 0 ? "text-text-body" : "text-green")}>
                  {o.price > 0 ? `+${money(o.price)}` : "Free"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
