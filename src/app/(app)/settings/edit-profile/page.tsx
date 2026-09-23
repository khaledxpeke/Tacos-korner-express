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
import { Card } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import { fakeUser } from "@/data/misc";

/** Mirrors `edit_profile_screen.dart`. Saves nowhere; shows a snackbar. */
export default function EditProfilePage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [f, setF] = useState({
    first: fakeUser.firstName,
    last: fakeUser.lastName,
    email: fakeUser.email,
    phone: fakeUser.phone.replace("+216 ", ""),
  });
  const [address, setAddress] = useState<AddressForm>({
    label: "Home",
    street: fakeUser.address,
    city: fakeUser.city,
    postalCode: fakeUser.postalCode,
    notes: "",
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
        <div className="flex flex-col items-center">
          <span className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-card shadow-card">
            <Image src={fakeUser.avatar} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              aria-label="Change photo"
              onClick={() => snack.show("Photo picker is UI only", "info")}
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/55 py-1.5 text-[10px] font-bold text-white"
            >
              <Icon name="camera-outline" size={12} />
              Edit
            </button>
          </span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card className="p-4">
            <p className="mb-3 text-xs font-bold tracking-wide text-text-muted md:text-sm md:tracking-normal">Personal</p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <TextField label="First name" value={f.first} onChange={set("first")} />
                <TextField label="Last name" value={f.last} onChange={set("last")} />
              </div>
              <TextField label="Email" type="email" icon="letter-outline" value={f.email} onChange={set("email")} />
              <PhoneField value={f.phone} onChange={set("phone")} />
            </div>
          </Card>
          <Card className="p-4" >
            <p className="mb-3 text-xs font-bold tracking-wide text-text-muted md:text-sm md:tracking-normal" id="address">Default address</p>
            <AddressFormFields value={address} onChange={setAddress} />
          </Card>
          <Card className="p-4 md:col-span-2">
            <p className="mb-3 text-xs font-bold tracking-wide text-text-muted md:text-sm md:tracking-normal">Allergies</p>
            <AllergySelector value={allergies} onChange={setAllergies} />
          </Card>
        </div>

        <div className="mt-6 hidden justify-end md:flex">
          <Button title="Save changes" icon="check-circle-bold" onClick={save} className="w-auto px-8" />
        </div>
      </Page>
      <PageFooter>
        <Button title="Save changes" icon="check-circle-bold" onClick={save} />
      </PageFooter>
    </>
  );
}
