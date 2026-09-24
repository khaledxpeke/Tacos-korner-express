"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Badge, QtyStepper } from "@/components/ui/Misc";
import { SafeImage } from "@/components/ui/SafeImage";
import { useCart } from "@/context/CartContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { restaurantOf } from "@/data/home";
import type { CartCustomization, CartItem, IngredientModel, ProductModel, ProductTypeModel } from "@/data/models";
import { cn, money } from "@/lib/utils";

type Selection = Record<string, IngredientModel[]>;

/** Mirrors `product_customizer_screen.dart`: option groups with min/max, qty, sticky total bar. */
export function CustomizerClient({
  product,
  editId,
}: {
  product: ProductModel;
  editId: string | null;
}) {
  const router = useRouter();
  const cart = useCart();
  const snack = useSnackbar();
  const restaurant = restaurantOf(product);

  const editing = editId ? cart.items.find((i) => i.id === editId) : undefined;

  const [selection, setSelection] = useState<Selection>(() => {
    const s: Selection = {};
    for (const t of product.types) s[t.id] = [];
    return s;
  });
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [appliedEdit, setAppliedEdit] = useState<string | null>(null);

  // Cart hydrates from localStorage after the first render. Copy the line once it appears.
  if (editing && appliedEdit !== editing.id) {
    const s: Selection = {};
    for (const t of product.types) {
      s[t.id] = editing.customizations.find((c) => c.typeId === t.id)?.selected ?? [];
    }
    setAppliedEdit(editing.id);
    setSelection(s);
    setQty(editing.quantity);
  }

  const extras = useMemo(
    () =>
      Object.values(selection)
        .flat()
        .reduce((sum, i) => sum + i.price, 0),
    [selection],
  );
  const unitTotal = product.price + extras;
  const grandTotal = unitTotal * qty;

  const isValid = product.types.every((t) => (selection[t.id]?.length ?? 0) >= t.min);

  function toggle(type: ProductTypeModel, option: IngredientModel) {
    setSelection((prev) => {
      const current = prev[type.id] ?? [];
      const has = current.some((o) => o.id === option.id);
      if (type.max === 1) {
        return { ...prev, [type.id]: has ? [] : [option] };
      }
      if (has) return { ...prev, [type.id]: current.filter((o) => o.id !== option.id) };
      if (current.length >= type.max) {
        snack.show(`You can only pick ${type.max} from "${type.name}"`, "warning");
        return prev;
      }
      return { ...prev, [type.id]: [...current, option] };
    });
  }

  function submit() {
    if (!isValid) {
      snack.show("Please complete all required selections", "error");
      return;
    }
    const customizations: CartCustomization[] = product.types
      .filter((t) => (selection[t.id]?.length ?? 0) > 0)
      .map((t) => ({ typeId: t.id, typeName: t.name, selected: selection[t.id] }));

    const item: CartItem = {
      id: editing ? editing.id : `${product.name}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      description: note.trim() || product.description,
      price: product.price,
      imageUrl: product.image,
      restaurantName: restaurant.name,
      quantity: qty,
      customizations,
    };

    if (editing) {
      cart.replaceItem(editing.id, item);
      snack.show("Cart updated", "success");
      router.push("/cart");
    } else {
      cart.addItem(item);
      snack.show(`${product.name} added to cart`, "success");
      router.push(`/restaurant/${restaurant.id}`);
    }
  }

  return (
    <>
      <div className="relative h-48 w-full md:hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <main className="flex-1">
        <Container className="py-5 md:py-8">
          <nav className="mb-6 hidden items-center gap-2 text-sm text-text-muted md:flex">
            <Link href="/home" className="hover:text-primary">Home</Link>
            <Icon name="alt-arrow-right-outline" size={14} className="rtl:rotate-180" />
            <Link href={`/product/${product.id}`} className="hover:text-primary">{product.name}</Link>
            <Icon name="alt-arrow-right-outline" size={14} className="rtl:rotate-180" />
            <span className="text-text">{editing ? "Edit" : "Customize"}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              {/* Header */}
              <div className="flex gap-4">
                <span className="relative hidden h-28 w-28 shrink-0 overflow-hidden rounded-[16px] md:block">
                  <SafeImage src={product.image} alt="" fill sizes="112px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="amber">
                      <Icon name="tuning-2-bold" size={11} /> Build your own
                    </Badge>
                    {editing && <Badge tone="blue">Editing cart item</Badge>}
                  </div>
                  <h1 className="mt-1.5 text-xl font-extrabold text-text md:text-3xl">{product.name}</h1>
                  <p className="mt-1 text-sm text-text-body">{product.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="text-xl font-extrabold text-primary">{money(product.price)}</span>
                    <span className="flex items-center gap-1 text-text-muted">
                      <Icon name="star-bold" size={14} className="text-amber" />
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs font-bold tracking-wide text-text-muted">AVAILABLE AT</p>
              <Link
                href={`/restaurant/${restaurant.id}`}
                className="mt-2 flex items-center gap-3 rounded-card border-[0.5px] border-border bg-card p-3 shadow-card"
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px]">
                  <SafeImage src={restaurant.image} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-text">{restaurant.name}</span>
                  <span className="flex items-center gap-1 truncate text-xs text-text-muted">
                    <Icon name="map-point-bold" size={11} />
                    {restaurant.address}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-text">
                  <Icon name="star-bold" size={12} className="text-amber" />
                  {restaurant.rating}
                </span>
                <Icon name="alt-arrow-right-outline" size={18} className="text-text-muted rtl:rotate-180" />
              </Link>

              {/* Groups */}
              <div className="mt-6 flex flex-col gap-4">
                {product.types.map((t) => (
                  <OptionGroup
                    key={t.id}
                    type={t}
                    selected={selection[t.id] ?? []}
                    onToggle={(o) => toggle(t, o)}
                  />
                ))}
              </div>

              <div className="mt-5">
                <TextArea
                  label="Special instructions (optional)"
                  placeholder="No onions, extra napkins…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={140}
                />
              </div>
            </div>

            {/* Desktop summary column */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-card border-[0.5px] border-border bg-card p-5 shadow-card">
                <h2 className="text-base font-extrabold text-text">Your build</h2>
                <ul className="mt-3 flex flex-col gap-2 text-sm">
                  <li className="flex justify-between text-text-body">
                    <span>{product.name}</span>
                    <span className="font-semibold text-text">{money(product.price)}</span>
                  </li>
                  {product.types.map((t) =>
                    (selection[t.id] ?? []).map((o) => (
                      <li key={o.id} className="flex justify-between text-text-muted">
                        <span className="truncate">+ {o.name}</span>
                        <span>{o.price > 0 ? money(o.price) : "Free"}</span>
                      </li>
                    )),
                  )}
                </ul>
                <div className="my-4 h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-body">Quantity</span>
                  <QtyStepper value={qty} onChange={setQty} size="sm" />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-text">Total</span>
                  <span className="text-2xl font-extrabold text-primary">{money(grandTotal)}</span>
                </div>
                <Button
                  title={editing ? "Update Cart" : "Add to Cart"}
                  icon={editing ? "pen-2-bold" : "cart-large-2-bold"}
                  isDisabled={!isValid}
                  onClick={submit}
                  className="mt-4"
                />
                {!isValid && (
                  <p className="mt-2 text-center text-xs text-text-muted">
                    Complete the required choices to continue
                  </p>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {/* Phone / tablet bottom bar */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-card pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <Container className="flex items-center gap-3">
          <QtyStepper value={qty} onChange={setQty} />
          <button
            type="button"
            disabled={!isValid}
            onClick={submit}
            className={cn(
              "flex h-12 flex-1 items-center justify-between rounded-[12px] px-4 text-sm font-bold text-white transition",
              isValid ? "bg-gradient-to-r from-primary to-primary-dark shadow-card" : "bg-text-muted/25 text-text-muted",
            )}
          >
            <span className="flex items-center gap-2">
              <Icon name={editing ? "pen-2-bold" : "cart-large-2-bold"} size={18} />
              {editing ? "Update Cart" : "Add to Cart"}
            </span>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs", isValid ? "bg-white/20" : "bg-border")}>
              {money(grandTotal)}
            </span>
          </button>
        </Container>
      </div>
    </>
  );
}

function OptionGroup({
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
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              required
                ? fulfilled
                  ? "bg-green-bg text-green"
                  : "bg-danger-bg text-danger"
                : "bg-card-gray text-text-muted",
            )}
          >
            {required && fulfilled && <Icon name="check-circle-bold" size={11} />}
            {required ? (fulfilled ? "Done" : "Required") : "Optional"}
          </span>
          {!single && (
            <span className={cn("text-[10px] font-semibold", count >= type.max ? "text-primary" : "text-text-muted")}>
              {count}/{type.max}
            </span>
          )}
        </div>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
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
