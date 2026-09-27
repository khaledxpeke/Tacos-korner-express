"use client";

import { useEffect, useState } from "react";
import { BackAppBar } from "@/components/layout/BackAppBar";
import { Page } from "@/components/layout/Page";
import { SegmentedToggle } from "@/components/orders/OrdersViewToggle";
import { ChangePasswordForm } from "@/components/security/ChangePasswordForm";
import { TwoFactorPanel } from "@/components/security/TwoFactorPanel";
import { Icon } from "@/components/ui/Icon";

type Tab = "password" | "2fa";

/** Password and two-factor sign-in. Opens on the password tab. */
export default function SecurityPage() {
  const [tab, setTab] = useState<Tab>("password");
  const [twoFactorOn, setTwoFactorOn] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
      setTwoFactorOn(!!window.localStorage.getItem("tk_2fa"));
    } catch {
      // Storage blocked: treat 2FA as off.
    }
  }, []);

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

          {tab === "password" ? (
            <>
              <ChangePasswordForm />
              <button
                type="button"
                onClick={() => setTab("2fa")}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-start shadow-card transition hover:border-amber md:p-5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-bg text-amber">
                  <Icon name="shield-keyhole-outline" size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-text">
                    {twoFactorOn ? "Manage two-factor authentication" : "Enable two-factor authentication"}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {twoFactorOn ? "On · authenticator app" : "Ask for a code from your authenticator app at sign-in"}
                  </span>
                </span>
                <Icon
                  name="alt-arrow-right-outline"
                  size={18}
                  className="text-text-muted transition group-hover:translate-x-0.5 group-hover:text-amber rtl:rotate-180"
                />
              </button>
            </>
          ) : (
            <TwoFactorPanel onStatusChange={setTwoFactorOn} />
          )}
        </div>
      </Page>
    </>
  );
}
