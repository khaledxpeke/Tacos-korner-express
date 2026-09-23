"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { OrderMode } from "@/lib/restaurants";
import { useLocalStorage } from "@/lib/useLocalStorage";

export type { OrderMode };

interface FulfillmentState {
  mode: OrderMode;
  address: string;
}

interface FulfillmentCtx extends FulfillmentState {
  ready: boolean;
  /** First visit: no address saved yet. */
  needsAddress: boolean;
  editorOpen: boolean;
  openEditor: () => void;
  closeEditor: () => void;
  setMode: (mode: OrderMode) => void;
  saveAddress: (address: string, mode?: OrderMode) => void;
}

const initial: FulfillmentState = { mode: "delivery", address: "" };

const Ctx = createContext<FulfillmentCtx | null>(null);

export function FulfillmentProvider({ children }: { children: ReactNode }) {
  const [state, setState, ready] = useLocalStorage<FulfillmentState>("tk_fulfillment", initial);
  const [editorOpen, setEditorOpen] = useState(false);

  const needsAddress = ready && state.address.trim().length === 0;

  return (
    <Ctx.Provider
      value={{
        ...state,
        ready,
        needsAddress,
        editorOpen,
        openEditor: () => setEditorOpen(true),
        closeEditor: () => setEditorOpen(false),
        setMode: (mode) => setState({ ...state, mode }),
        saveAddress: (address, mode) => {
          setState({ mode: mode ?? state.mode, address: address.trim() });
          setEditorOpen(false);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFulfillment() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFulfillment must be used within FulfillmentProvider");
  return ctx;
}
