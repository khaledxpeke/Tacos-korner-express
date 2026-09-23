import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";

/** Main site shell: desktop header + footer. Phones get the app bars from each page. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
