"use client";

import { useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { SegmentedToggle } from "@/components/orders/OrdersViewToggle";
import { ChangePasswordForm } from "@/components/security/ChangePasswordForm";
import { TwoFactorPanel } from "@/components/security/TwoFactorPanel";

type Tab = "password" | "2fa";

/** Password and two-factor sign-in. Opens on the password tab. */
export default function SecurityPage() {
  const [tab, setTab] = useState<Tab>("password");

  return (
    <>
      <BackAppBar title="Security" subtitle="Your password and two-factor sign-in" fallbackHref="/profile" />
      <Page>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <SegmentedToggle
            value={tab}
            onChange={setTab}
            options={[
              { value: "password", label: "Password" },
              { value: "2fa", label: "Two-factor" },
            ]}
          />

          {tab === "password" ? <ChangePasswordForm /> : <TwoFactorPanel />}
        </div>
      </Page>
    </>
  );
}
