import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LoyaltyShell } from "@/components/fidelite/Shell";

export const metadata: Metadata = {
  title: "Fidélité · Takos Korner",
  description: "Connexion, inscription et points fidélité.",
};

export default function FideliteLayout({ children }: { children: ReactNode }) {
  return <LoyaltyShell>{children}</LoyaltyShell>;
}
