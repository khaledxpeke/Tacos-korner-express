import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

/**
 * Auth shell. Phones: the form itself.
 * Desktop: onboarding panel on the left, sign-in or sign-up on the right.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 md:grid md:min-h-dvh md:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex flex-1 flex-col bg-bg md:justify-center md:overflow-y-auto md:px-12 md:py-10">
        <div className="flex w-full flex-1 flex-col md:mx-auto md:max-w-[420px] md:flex-none">
          {children}
        </div>
      </div>
    </div>
  );
}
