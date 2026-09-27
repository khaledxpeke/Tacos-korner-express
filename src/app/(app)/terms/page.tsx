import { LegalPage } from "@/components/legal/LegalPage";
import { termsDoc } from "@/data/legal";

export const metadata = { title: "Terms of Service · Takos Korner" };

export default function TermsPage() {
  return <LegalPage {...termsDoc} />;
}
