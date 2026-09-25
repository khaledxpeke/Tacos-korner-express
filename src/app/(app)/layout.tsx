import type { ReactNode } from "react";
import { AddressPrompt, FulfillmentBar } from "@/components/layout/FulfillmentBar";
import { Container } from "@/components/layout/Container";
import { RequireLocation } from "@/components/layout/RequireLocation";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";

/** Main site shell: desktop header + footer. Phones get the app bars from each page. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireLocation>
      <div className="flex min-h-dvh flex-1 flex-col">
        <SiteHeader />
        <div className="hidden h-[68px] shrink-0 md:block" aria-hidden />
        <div className="sticky top-0 z-30 shrink-0 border-b border-border bg-card md:hidden">
          <Container className="py-2">
            <FulfillmentBar />
          </Container>
        </div>
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </div>
      <AddressPrompt />
    </RequireLocation>
  );
}
