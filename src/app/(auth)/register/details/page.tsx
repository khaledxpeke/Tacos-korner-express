"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  AddressFormFields,
  AllergySelector,
  AuthHeader,
  StepProgressBar,
  type AddressForm,
} from "@/components/auth/AuthWidgets";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SelectableChip } from "@/components/ui/Misc";
import { useSnackbar } from "@/context/SnackbarContext";
import { cn } from "@/lib/utils";

function subscribeNothing() {
  return () => {};
}

function readRegisterFirstName() {
  try {
    const raw = window.sessionStorage.getItem("tk_register");
    return raw ? (JSON.parse(raw).first as string) || "" : "";
  } catch {
    return "";
  }
}

const steps = ["Address", "Allergies", "About you"];
const genders = [
  { v: "female", label: "Female", icon: "user-outline" },
  { v: "male", label: "Male", icon: "user-outline" },
  { v: "other", label: "Prefer not to say", icon: "user-circle-outline" },
];

/** Mirrors `registration_details_flow_screen.dart`: stepped address → allergies → gender/birthday. */
export default function RegistrationDetailsPage() {
  const router = useRouter();
  const snack = useSnackbar();
  const [step, setStep] = useState(0);
  const name = useSyncExternalStore(subscribeNothing, readRegisterFirstName, () => "");
  const [address, setAddress] = useState<AddressForm>({
    label: "Home",
    street: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [allergies, setAllergies] = useState<string[]>([]);
  const [gender, setGender] = useState<string | null>(null);
  const [birthday, setBirthday] = useState("");

  function next() {
    if (step === 0 && (!address.street.trim() || !address.city)) {
      snack.show("Please add your street and city", "warning");
      return;
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    window.localStorage.setItem("tk_onboarded", "1");
    snack.show("Account created — welcome!", "success");
    router.push("/home");
  }

  return (
    <div className="flex flex-1 flex-col">
      <AuthHeader
        title={name ? `Hi ${name} 👋` : "Almost there"}
        subtitle="Tell us where to deliver and what to avoid."
        gradient="from-tertiary to-tertiary-dark"
        showBack
        onBack={() => (step > 0 ? setStep(step - 1) : router.back())}
        footer={<StepProgressBar step={step} total={steps.length} />}
      />
      <div className="flex flex-1 flex-col px-7 py-7 md:px-0">
        <p className="text-[11px] font-bold tracking-wide text-text-muted">
          STEP {step + 1} OF {steps.length}
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-text">{steps[step]}</h2>

        <div className="mt-5 flex-1">
          {step === 0 && <AddressFormFields value={address} onChange={setAddress} />}
          {step === 1 && (
            <>
              <p className="mb-3 text-sm text-text-body">
                We&apos;ll flag dishes containing these. You can change this later in Settings.
              </p>
              <AllergySelector value={allergies} onChange={setAllergies} />
              {allergies.length === 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
                  <Icon name="check-circle-bold" size={14} className="text-green" />
                  No allergies — great, everything&apos;s on the menu.
                </p>
              )}
            </>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-xs font-semibold text-text-body">Gender (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {genders.map((g) => (
                    <SelectableChip
                      key={g.v}
                      label={g.label}
                      icon={g.icon}
                      selected={gender === g.v}
                      onClick={() => setGender(gender === g.v ? null : g.v)}
                    />
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-text-body">Birthday (optional)</span>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-text outline-none focus:border-primary"
                />
                <span className="mt-1 block text-xs text-text-muted">We send a treat on your birthday 🎂</span>
              </label>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className={cn("rounded-[12px] border border-border px-5 text-sm font-semibold text-text")}
            >
              Back
            </button>
          )}
          <Button
            title={step === steps.length - 1 ? "Finish" : "Continue"}
            icon={step === steps.length - 1 ? "check-circle-bold" : "alt-arrow-right-outline"}
            iconRight
            className="flex-1"
            onClick={next}
          />
        </div>
        {step > 0 && (
          <button type="button" onClick={next} className="mt-3 text-center text-xs font-semibold text-text-muted">
            Skip this step
          </button>
        )}
      </div>
    </div>
  );
}
