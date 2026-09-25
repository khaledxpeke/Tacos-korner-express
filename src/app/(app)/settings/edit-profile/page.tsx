"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressFormFields, AllergySelector, type AddressForm } from "@/components/auth/AuthWidgets";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page, PageFooter } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { PhoneField, TextField } from "@/components/ui/Fields";
import { Icon } from "@/components/ui/Icon";
import { Card, SelectableChip } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import { fakeUser } from "@/data/misc";

const genders = [
  { v: "female", label: "Female" },
  { v: "male", label: "Male" },
  { v: "other", label: "Prefer not to say" },
];

/** Mirrors `edit_profile_screen.dart`. Saves nowhere; shows a snackbar. */
export default function EditProfilePage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [f, setF] = useState({
    first: fakeUser.firstName,
    last: fakeUser.lastName,
    email: fakeUser.email,
    phone: fakeUser.phone.replace("+216 ", ""),
    birthday: "1998-06-15",
  });
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState<AddressForm>({
    label: "Home",
    street: fakeUser.address,
    city: fakeUser.city,
    postalCode: fakeUser.postalCode,
    notes: "Floor 3, ring twice",
  });
  const [allergies, setAllergies] = useState<string[]>(["Nuts"]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  function save() {
    snack.show("Profile updated", "success");
    router.push("/profile");
  }

  return (
    <>
      <BackAppBar title="Edit Profile" fallbackHref="/settings" />
      <Page>
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          <div className="flex items-center gap-4">
            <span className="relative shrink-0">
              <span className="relative block h-20 w-20 overflow-hidden rounded-full ring-4 ring-card shadow-card">
                <Image src={fakeUser.avatar} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <button
                type="button"
                aria-label="Change photo"
                onClick={() => snack.show("Photo picker is UI only", "info")}
                className="absolute -bottom-0.5 -end-0.5 grid h-8 w-8 place-items-center rounded-full bg-primary text-white shadow-card hover:bg-primary-dark"
              >
                <Icon name="camera-outline" size={15} />
              </button>
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold text-text">
                {f.first} {f.last}
              </h2>
              <p className="truncate text-sm text-text-muted">{f.email}</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-text">Personal</h3>
              <p className="mt-0.5 text-xs text-text-muted">How we reach you and what we remember.</p>
              <div className="mt-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <TextField label="First name" value={f.first} onChange={set("first")} />
                  <TextField label="Last name" value={f.last} onChange={set("last")} />
                </div>
                <TextField label="Email" type="email" icon="letter-outline" value={f.email} onChange={set("email")} />
                <PhoneField value={f.phone} onChange={set("phone")} />
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-text-body">
                    <Icon name="calendar-outline" size={14} />
                    Date of birth
                  </span>
                  <input
                    type="date"
                    value={f.birthday}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={set("birthday")}
                    className="h-12 w-full rounded-[12px] border border-border bg-card px-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </label>
                <div>
                  <p className="mb-2 text-xs font-semibold text-text-body">Gender</p>
                  <div className="flex flex-wrap gap-2">
                    {genders.map((g) => (
                      <SelectableChip
                        key={g.v}
                        label={g.label}
                        selected={gender === g.v}
                        onClick={() => setGender(g.v)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-text">Default address</h3>
              <p className="mt-0.5 text-xs text-text-muted">Start typing and pick a suggested street.</p>
              <div className="mt-4">
                <AddressFormFields value={address} onChange={setAddress} />
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="text-sm font-extrabold text-text">Allergies</h3>
            <p className="mt-0.5 text-xs text-text-muted">
              We flag dishes that contain these. Add another if yours is not listed.
            </p>
            <div className="mt-4">
              <AllergySelector value={allergies} onChange={setAllergies} />
            </div>
          </Card>

          <div className="hidden justify-end md:flex">
            <div className="w-52">
              <Button title="Save changes" icon="check-circle-bold" onClick={save} />
            </div>
          </div>
        </div>
      </Page>
      <PageFooter>
        <Button title="Save changes" icon="check-circle-bold" onClick={save} />
      </PageFooter>
    </>
  );
}
