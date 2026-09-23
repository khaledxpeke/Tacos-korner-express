import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Privacy Policy · Takos Korner" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      sections={[
        {
          title: "What we collect",
          body: [
            "Account details you give us (name, email, phone), delivery addresses, and your order history.",
            "Device and usage information such as app version, language, and the screens you visit, used to keep the service working.",
          ],
        },
        {
          title: "How we use it",
          body: [
            "To prepare and deliver your orders, send order status updates, and show you relevant restaurants and offers.",
            "We never sell your personal data.",
          ],
        },
        {
          title: "Sharing",
          body: [
            "Restaurants receive only what they need to prepare your order. Couriers receive your delivery address and phone number for the duration of the delivery.",
          ],
        },
        {
          title: "Your choices",
          body: [
            "You can edit or delete your account in Settings. Marketing notifications can be turned off at any time under Settings › Notifications.",
          ],
        },
        {
          title: "Contact",
          body: ["Questions about privacy: support@takoskorner.tn."],
        },
      ]}
    />
  );
}
