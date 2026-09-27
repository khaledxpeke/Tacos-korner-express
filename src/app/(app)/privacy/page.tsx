import { LegalPage } from "@/components/legal/LegalPage";
import { privacyDoc } from "@/data/legal";

export const metadata = { title: "Privacy Policy · Takos Korner" };

export default function PrivacyPage() {
  return <LegalPage {...privacyDoc} />;
}
