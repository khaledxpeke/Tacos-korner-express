"use client";

import { useState } from "react";
import { AddressFormFields, type AddressForm } from "@/components/auth/AuthWidgets";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { Button, SecondaryButton } from "@/components/ui/Button";
import { BottomSheet, Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { EmptyCard } from "@/components/ui/Misc";
import {
  MAX_ADDRESSES,
  addressTypeIcon,
  addressTypes,
  formatAddress,
  repeatableType,
  useAddressBook,
  type AddressType,
  type SavedAddress,
} from "@/context/AddressBookContext";
import { useFulfillment } from "@/context/FulfillmentContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { cn } from "@/lib/utils";

type Editing = { id: string | null; form: AddressForm };

const blank = (type: AddressType): AddressForm => ({
  label: type,
  street: "",
  city: "Tunis",
  postalCode: "",
  notes: "",
});

/** Up to three saved addresses, each with a type (Home, Work, …). */
export default function AddressesPage() {
  const book = useAddressBook();
  const { saveAddress } = useFulfillment();
  const snack = useSnackbar();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [deleting, setDeleting] = useState<SavedAddress | null>(null);

  function openNew() {
    if (book.isFull) return;
    const taken = book.takenTypes();
    const free = addressTypes.find((t) => !taken.includes(t.label))?.label ?? repeatableType;
    setEditing({ id: null, form: blank(free) });
  }

  function openEdit(a: SavedAddress) {
    setEditing({
      id: a.id,
      form: { label: a.type, street: a.street, city: a.city, postalCode: a.postalCode, notes: a.notes },
    });
  }

  function submit() {
    if (!editing) return;
    const { form, id } = editing;
    const draft = {
      type: form.label as AddressType,
      street: form.street.trim(),
      city: form.city,
      postalCode: form.postalCode.trim(),
      notes: form.notes.trim(),
    };
    if (id) {
      book.update(id, draft);
      snack.show("Address updated", "success");
    } else {
      book.add(draft);
      snack.show("Address added", "success");
    }
    setEditing(null);
  }

  const canSubmit = !!editing && editing.form.street.trim().length >= 4 && !!editing.form.city;

  return (
    <>
      <BackAppBar
        title="Addresses"
        subtitle={`${book.addresses.length} of ${MAX_ADDRESSES} saved`}
        fallbackHref="/profile"
      />
      <Page>
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center md:p-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-bg text-primary">
                <Icon name="map-point-bold" size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text">
                  {book.addresses.length} of {MAX_ADDRESSES} addresses saved
                </p>
                <div className="mt-1.5 flex max-w-56 gap-1">
                  {Array.from({ length: MAX_ADDRESSES }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full",
                        i < book.addresses.length ? "bg-primary" : "bg-border",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="sm:w-44 sm:shrink-0">
              <Button title="Add address" icon="add-circle-outline" isDisabled={book.isFull} onClick={openNew} />
            </div>
          </div>
          {book.isFull && (
            <p className="-mt-2 px-1 text-xs text-text-muted">
              You can save up to {MAX_ADDRESSES} addresses. Delete one to add another.
            </p>
          )}

          {book.addresses.length === 0 ? (
            <EmptyCard
              icon="map-point-outline"
              title="No saved addresses"
              message="Save home, work or anywhere you order often."
            />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {book.addresses.map((a) => (
                <li
                  key={a.id}
                  className={cn(
                    "flex flex-col rounded-2xl border bg-card p-4 shadow-card transition",
                    a.isDefault ? "border-primary/40 ring-1 ring-primary/10" : "border-border",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                        a.isDefault ? "bg-primary text-white" : "bg-bg text-text-body",
                      )}
                    >
                      <Icon name={addressTypeIcon(a.type)} size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-extrabold text-text">{a.type}</p>
                        {a.isDefault && (
                          <span className="rounded-full bg-primary-bg px-2 py-0.5 text-[10px] font-bold text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-text-body">{a.street}</p>
                      <p className="text-xs text-text-muted">
                        {[a.postalCode, a.city].filter(Boolean).join(" ")}
                      </p>
                      {a.notes && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-text-muted">
                          <Icon name="notes-outline" size={13} />
                          {a.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                    {!a.isDefault ? (
                      <button
                        type="button"
                        onClick={() => {
                          book.setDefault(a.id);
                          saveAddress(formatAddress(a));
                          snack.show(`${a.type} is now your default address`, "success");
                        }}
                        className="me-auto text-xs font-bold text-primary hover:underline"
                      >
                        Set as default
                      </button>
                    ) : (
                      <span className="me-auto flex items-center gap-1 text-xs font-semibold text-text-muted">
                        <Icon name="check-circle-bold" size={14} className="text-primary" />
                        Used for delivery
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      aria-label={`Edit ${a.type} address`}
                      className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-text transition hover:bg-bg"
                    >
                      <Icon name="pen-outline" size={14} />
                      <span className="max-sm:sr-only">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(a)}
                      aria-label={`Delete ${a.type} address`}
                      className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-danger transition hover:bg-danger-bg"
                    >
                      <Icon name="trash-bin-trash-outline" size={14} />
                      <span className="max-sm:sr-only">Delete</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Page>

      <BottomSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit address" : "New address"}
      >
        {editing && (
          <div className="px-5">
            <AddressFormFields
              value={editing.form}
              onChange={(form) => setEditing({ ...editing, form })}
              types={addressTypes}
              disabledTypes={book.takenTypes(editing.id ?? undefined)}
            />
            <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
              <SecondaryButton title="Cancel" className="px-6 py-3 font-bold" onClick={() => setEditing(null)} />
              <Button
                title={editing.id ? "Save changes" : "Save address"}
                icon="check-circle-bold"
                isDisabled={!canSubmit}
                onClick={submit}
              />
            </div>
          </div>
        )}
      </BottomSheet>

      <Dialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        danger
        title="Delete address?"
        message={deleting ? `${deleting.type} · ${formatAddress(deleting)} will be removed.` : undefined}
        confirmText="Delete"
        onConfirm={() => {
          if (!deleting) return;
          book.remove(deleting.id);
          snack.show("Address deleted", "info");
        }}
      />
    </>
  );
}
