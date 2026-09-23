import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Terms of Service · Takos Korner" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="July 2026"
      sections={[
        {
          title: "Using the service",
          body: [
            "Takos Korner Express lets you order food from partner restaurants for delivery or pickup. You must be at least 16 to create an account.",
          ],
        },
        {
          title: "Orders and payment",
          body: [
            "Prices shown include VAT. Delivery and service fees are displayed before you confirm. An order is final once the restaurant has accepted it.",
          ],
        },
        {
          title: "Cancellations and refunds",
          body: [
            "You can cancel while an order is Pending. After that, contact support and we will work with the restaurant on a fair outcome.",
          ],
        },
        {
          title: "Promotions",
          body: [
            "Promo codes are single use unless stated otherwise and cannot be exchanged for cash.",
          ],
        },
        {
          title: "Liability",
          body: [
            "Restaurants are responsible for the food they prepare. We are responsible for the platform and the delivery experience.",
          ],
        },
      ]}
    />
  );
}
