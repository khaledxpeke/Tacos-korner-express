import type { ReactNode } from "react";
import { AddressPrompt, FulfillmentBar } from "@/components/layout/FulfillmentBar";
import { Container } from "@/components/layout/Container";
import { RequireLocation } from "@/components/layout/RequireLocation";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";

/** Main site shell: desktop header + footer. Phones get the app bars from each page. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireLocation>
      <SiteHeader />
      <div className="hidden h-[68px] md:block" aria-hidden />
      <div className="sticky top-0 z-30 border-b border-border bg-card md:hidden">
        <Container className="py-2">
          <FulfillmentBar />
        </Container>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
      <AddressPrompt />
    </RequireLocation>
  );
}
