import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

/** Tab screens: bottom nav on phones only. */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex flex-1 flex-col">{children}</div>
      <BottomNav />
    </>
  );
}
