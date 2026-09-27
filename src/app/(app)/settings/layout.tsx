import type { ReactNode } from "react";
import { AccountShell } from "@/components/profile/AccountNav";

export default function Layout({ children }: { children: ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
