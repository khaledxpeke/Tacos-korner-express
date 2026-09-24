"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CartItem } from "@/data/models";
import {
  customizationSummary,
  DELIVERY_FEE,
  lineTotal,
  SERVICE_FEE,
} from "@/lib/cart";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface CartState {
  items: CartItem[];
  savedCombos: CartItem[];
  promoCode: string;
  discount: number;
  tipPercent: number;
  note: string;
}

function cartLineId(name: string) {
  return `${name}_${Date.now()}`;
}

const initialState: CartState = {
  items: [],
  savedCombos: [],
  promoCode: "",
  discount: 0,
  tipPercent: 0,
  note: "",
};

interface CartCtx extends CartState {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tipAmount: number;
  total: number;
  addItem: (item: CartItem) => void;
  addItems: (items: CartItem[]) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  replaceItem: (id: string, item: CartItem) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  setTipPercent: (p: number) => void;
  setNote: (n: string) => void;
  isComboSaved: (item: CartItem) => boolean;
  saveCombo: (item: CartItem) => void;
  removeSavedCombo: (name: string, summary: string) => void;
  addSavedComboToCart: (saved: CartItem) => void;
}

const Ctx = createContext<CartCtx | null>(null);

function sameLine(a: CartItem, b: CartItem) {
  return (
    a.id === b.id ||
    (a.name === b.name && customizationSummary(a) === customizationSummary(b))
  );
}

function mergeLines(existing: CartItem[], incoming: CartItem[]) {
  const items = [...existing];
  for (const item of incoming) {
    const idx = items.findIndex((i) => sameLine(i, item));
    if (idx >= 0) {
      items[idx] = {
        ...items[idx],
        quantity: items[idx].quantity + item.quantity,
      };
    } else {
      items.push(item);
    }
  }
  return items;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<CartState>("tk_cart", initialState);

  const subtotal = useMemo(
    () => state.items.reduce((s, i) => s + lineTotal(i), 0),
    [state.items],
  );
  const tipAmount = subtotal * (state.tipPercent / 100);
  const total = Math.max(
    0,
    subtotal + DELIVERY_FEE + SERVICE_FEE + tipAmount - state.discount,
  );

  const value: CartCtx = {
    ...state,
    itemCount: state.items.reduce((s, i) => s + i.quantity, 0),
    subtotal,
    deliveryFee: DELIVERY_FEE,
    serviceFee: SERVICE_FEE,
    tipAmount,
    total,
    addItem: (item) =>
      setState((s) => ({
        ...s,
        items: mergeLines(s.items, [item]),
      })),
    addItems: (items) =>
      setState((s) => ({
        ...s,
        items: mergeLines(s.items, items),
      })),
    incrementItem: (id) =>
      setState((s) => ({
        ...s,
        items: s.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      })),
    decrementItem: (id) =>
      setState((s) => ({
        ...s,
        items: s.items
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      })),
    removeItem: (id) =>
      setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
    replaceItem: (id, item) =>
      setState((s) => ({
        ...s,
        items: s.items.map((i) => (i.id === id ? item : i)),
      })),
    clearCart: () =>
      setState((s) => ({
        ...s,
        items: [],
        promoCode: "",
        discount: 0,
        note: "",
      })),
    applyPromoCode: (code) => {
      const upper = code.trim().toUpperCase();
      if (upper === "TACO10") {
        setState((s) => ({ ...s, promoCode: upper, discount: subtotal * 0.1 }));
        return true;
      }
      if (upper === "WELCOME") {
        setState((s) => ({ ...s, promoCode: upper, discount: 3 }));
        return true;
      }
      return false;
    },
    removePromoCode: () =>
      setState((s) => ({ ...s, promoCode: "", discount: 0 })),
    setTipPercent: (p) => setState((s) => ({ ...s, tipPercent: p })),
    setNote: (n) => setState((s) => ({ ...s, note: n })),
    isComboSaved: (item) =>
      state.savedCombos.some(
        (c) =>
          c.name === item.name &&
          customizationSummary(c) === customizationSummary(item),
      ),
    saveCombo: (item) =>
      setState((s) => {
        const exists = s.savedCombos.some(
          (c) =>
            c.name === item.name &&
            customizationSummary(c) === customizationSummary(item),
        );
        if (exists) return s;
        return {
          ...s,
          savedCombos: [
            ...s.savedCombos,
            {
              ...item,
              id: `saved_${cartLineId(item.name)}`,
              quantity: 1,
              customizations: item.customizations.map((c) => ({ ...c })),
            },
          ],
        };
      }),
    removeSavedCombo: (name, summary) =>
      setState((s) => ({
        ...s,
        savedCombos: s.savedCombos.filter(
          (c) => !(c.name === name && customizationSummary(c) === summary),
        ),
      })),
    addSavedComboToCart: (saved) =>
      value.addItem({
        ...saved,
        id: cartLineId(saved.name),
        quantity: 1,
        customizations: saved.customizations.map((c) => ({ ...c })),
      }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside CartProvider");
  return v;
}
