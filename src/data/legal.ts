import type { LegalSection } from "@/components/legal/LegalPage";

export interface LegalDoc {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}

export const termsDoc: LegalDoc = {
  title: "Terms of Service",
  updated: "September 2026",
  intro: "These terms explain how ordering on Takos Korner Express works: what we do, what restaurants do, and what we ask of you. By creating an account or placing an order you agree to them.",
  sections: [
    {
      title: "Who we are",
      body: [
        "Takos Korner Express is an online marketplace that connects you with partner restaurants in Tunisia for delivery or pickup. We run the website and app, take your order and payment, and organise delivery. The restaurant prepares your food.",
      ],
    },
    {
      title: "Your account",
      body: [
        "You must be at least 16 years old to create an account. Keep your password private; you are responsible for orders placed from your account.",
        "Give us accurate details, especially your phone number and delivery addresses, so couriers can reach you. You can save up to three addresses in your account.",
        "We may suspend accounts used for fraud, abuse of promotions, or harassment of restaurant staff or couriers.",
      ],
    },
    {
      title: "Placing an order",
      body: [
        "Menus, prices, photos and availability come from the restaurants and may change. Photos are illustrations; the dish you receive may look slightly different.",
        "Your order is a request to the restaurant. It becomes binding once the restaurant accepts it, which you will see as the status moves from Pending to Preparing.",
        "If an item is unavailable, the restaurant or our support team will contact you to offer a replacement or a refund for that item.",
      ],
    },
    {
      title: "Prices, fees and payment",
      body: [
        "Prices shown include VAT. Before you confirm, the checkout lists the items, delivery fee, service fee, any courier tip, and any discount, together with the total you will pay.",
        "You can pay cash on delivery, by card, or with a supported mobile wallet. Card payments are processed by a licensed payment provider; we never store your full card number.",
        "Tips go in full to the courier.",
      ],
    },
    {
      title: "Delivery and pickup",
      body: [
        "Delivery times are estimates based on the restaurant's preparation time, distance and traffic. We will keep you updated in My Orders if an order is running late.",
        "Please be available at the address you chose. If the courier cannot reach you after reasonable attempts, the order may be marked as delivered and not refunded.",
        "For pickup orders, collect your food at the counter within 30 minutes of the ready time and show your order number.",
      ],
    },
    {
      title: "Cancellations and refunds",
      body: [
        "You can cancel free of charge while an order is still Pending. Once the restaurant has started preparing, we cannot guarantee a refund.",
        "If something is missing, wrong, or arrives in poor condition, contact us from Help & Support within 24 hours, ideally with a photo. We will work with the restaurant on a refund, credit, or replacement.",
        "Refunds go back to the original payment method, usually within 5–10 business days. Cash orders are refunded as account credit.",
      ],
    },
    {
      title: "Allergies and dietary needs",
      body: [
        "Allergen information is supplied by restaurants. The allergies you save in your profile help us flag dishes, but kitchens handle many ingredients and cannot rule out cross-contamination.",
        "If you have a severe allergy, add a note to your order and contact the restaurant before ordering.",
      ],
    },
    {
      title: "Promotions and Korner Points",
      body: [
        "Promo codes are single use per account unless stated otherwise, cannot be combined, and cannot be exchanged for cash.",
        "Korner Points are earned on completed orders and can be redeemed for rewards shown in the app. Points have no cash value and may expire after 12 months without an order.",
      ],
    },
    {
      title: "Reviews and content",
      body: [
        "Reviews must be honest and about your own experience. We may remove reviews that are abusive, off-topic, or contain personal information.",
      ],
    },
    {
      title: "Liability",
      body: [
        "Restaurants are responsible for the food they prepare, including its quality, safety and allergen information. We are responsible for the platform, payment, and delivery service.",
        "Nothing in these terms limits your rights as a consumer under Tunisian law.",
      ],
    },
    {
      title: "Changes to these terms",
      body: [
        "We may update these terms when the service changes. We will tell you about significant changes in the app or by email before they apply.",
      ],
    },
    {
      title: "Contact",
      body: ["Questions about these terms: support@takoskorner.tn or +216 70 123 456."],
    },
  ],
};

export const privacyDoc: LegalDoc = {
  title: "Privacy Policy",
  updated: "September 2026",
  intro: "This policy explains what personal data Takos Korner Express collects, why we need it, who we share it with, and the choices you have. We collect only what we need to get your food to you.",
  sections: [
    {
      title: "What we collect",
      body: [
        "Account details: your name, email, phone number, date of birth and gender if you add them, and your profile photo.",
        "Addresses: up to three saved addresses with their type (Home, Work, and so on) and delivery notes, plus the address you are currently ordering to.",
        "Orders: what you ordered, from which restaurant, when, how much you paid, tips, promo codes used, and any notes or reviews you leave.",
        "Preferences: allergies you save, favourite dishes and restaurants, saved combos, language, theme and notification settings.",
        "Device and usage data: app version, browser, approximate location from your address, and the screens you visit, used to keep the service working and fix problems.",
      ],
    },
    {
      title: "Payment information",
      body: [
        "Card and mobile wallet payments are handled by our payment provider. We receive only a confirmation, the card type and its last four digits; we never see or store your full card number.",
      ],
    },
    {
      title: "How we use your data",
      body: [
        "To take, prepare and deliver your orders, and to send you order status updates.",
        "To flag dishes that contain allergens you have saved, and to show restaurants and dishes near you.",
        "To give support, handle refunds, and prevent fraud and abuse of promotions.",
        "To send offers and reminders, only if you have turned them on in Notifications.",
        "We never sell your personal data.",
      ],
    },
    {
      title: "Who we share it with",
      body: [
        "Restaurants receive your first name, your order, your notes and your allergies for that order.",
        "Couriers receive your first name, delivery address, notes and phone number, only for the duration of the delivery.",
        "Service providers such as our payment processor, hosting, maps and email or SMS providers, who process data on our behalf under contract.",
        "Authorities, when the law requires it.",
      ],
    },
    {
      title: "Location",
      body: [
        "We use the address you type or pick on the map to find kitchens near you and to deliver. If you choose \"Use current location\", your device shares its position once to drop the pin; we do not track your location in the background.",
      ],
    },
    {
      title: "Cookies and local storage",
      body: [
        "We store a few things in your browser, such as your cart, language, theme, delivery address and notification preferences, so the site remembers them between visits. We do not use advertising cookies.",
      ],
    },
    {
      title: "How long we keep it",
      body: [
        "We keep your account data while your account is open. Order records are kept for the period required by Tunisian accounting and tax law. When you delete your account, we delete or anonymise the rest within 30 days.",
      ],
    },
    {
      title: "Your rights",
      body: [
        "You can view and edit your profile, addresses and allergies at any time from your Account.",
        "You can ask us for a copy of your data, ask us to correct it, or ask us to delete your account, in line with Tunisian data protection law (Organic Law No. 2004-63).",
        "You can turn off marketing notifications at any time in Account › Notifications, and set quiet hours or pause notifications.",
      ],
    },
    {
      title: "Security",
      body: [
        "Data is encrypted in transit, access is limited to staff who need it, and passwords are stored hashed. Use a password you don't reuse elsewhere.",
      ],
    },
    {
      title: "Children",
      body: ["The service is not meant for children under 16, and we do not knowingly collect their data."],
    },
    {
      title: "Changes to this policy",
      body: [
        "If we change how we use your data, we will update this page and tell you in the app or by email before the change applies.",
      ],
    },
    {
      title: "Contact",
      body: ["Questions or requests about your data: support@takoskorner.tn."],
    },
  ],
};
