"use client";

import { createContext, useContext, type ReactNode } from "react";
import { fakeUser } from "@/data/misc";
import { useLocalStorage } from "@/lib/useLocalStorage";

export const MAX_ADDRESSES = 3;

export const addressTypes = [
  { label: "Home", icon: "home-2-outline" },
  { label: "Work", icon: "case-outline" },
  { label: "Partner", icon: "heart-angle-outline" },
  { label: "Family", icon: "users-group-rounded-outline" },
  { label: "University", icon: "square-academic-cap-outline" },
  { label: "Other", icon: "map-point-outline" },
] as const;

export type AddressType = (typeof addressTypes)[number]["label"];

/** "Other" may be used more than once; every other type labels a single address. */
export const repeatableType: AddressType = "Other";

export function addressTypeIcon(type: string) {
  return addressTypes.find((t) => t.label === type)?.icon ?? "map-point-outline";
}

export interface SavedAddress {
  id: string;
  type: AddressType;
  street: string;
  city: string;
  postalCode: string;
  notes: string;
  isDefault: boolean;
}

export type AddressDraft = Omit<SavedAddress, "id" | "isDefault">;

/** One line for chips, checkout and the delivery address. */
export function formatAddress(a: Pick<SavedAddress, "street" | "city" | "postalCode">) {
  return [a.street, [a.postalCode, a.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

const seed: SavedAddress[] = [
  {
    id: "home",
    type: "Home",
    street: fakeUser.address,
    city: fakeUser.city,
    postalCode: fakeUser.postalCode,
    notes: "",
    isDefault: true,
  },
];

interface AddressBookCtx {
  addresses: SavedAddress[];
  ready: boolean;
  isFull: boolean;
  /** Types already used, except the repeatable one. Pass `exceptId` when editing so its own type stays free. */
  takenTypes: (exceptId?: string) => AddressType[];
  add: (draft: AddressDraft) => SavedAddress | null;
  update: (id: string, draft: AddressDraft) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

const Ctx = createContext<AddressBookCtx | null>(null);

export function AddressBookProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses, ready] = useLocalStorage<SavedAddress[]>("tk_address_book", seed);

  const isFull = addresses.length >= MAX_ADDRESSES;

  return (
    <Ctx.Provider
      value={{
        addresses,
        ready,
        isFull,
        takenTypes: (exceptId) =>
          addresses
            .filter((a) => a.id !== exceptId && a.type !== repeatableType)
            .map((a) => a.type),
        add: (draft) => {
          if (isFull) return null;
          const created: SavedAddress = {
            ...draft,
            id: `${Date.now()}`,
            isDefault: addresses.length === 0,
          };
          setAddresses([...addresses, created]);
          return created;
        },
        update: (id, draft) =>
          setAddresses(addresses.map((a) => (a.id === id ? { ...a, ...draft } : a))),
        remove: (id) => {
          const next = addresses.filter((a) => a.id !== id);
          // Keep one default while any address is left.
          if (next.length > 0 && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true };
          setAddresses(next);
        },
        setDefault: (id) => setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id }))),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAddressBook() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAddressBook must be used within AddressBookProvider");
  return ctx;
}
