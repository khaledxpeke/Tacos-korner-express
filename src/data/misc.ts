import type { NotificationModel, ReelModel } from "./models";

export const supportEmail = "support@takoskorner.tn";
export const supportPhone = "+216 70 123 456";
export const supportWebsite = "https://takoskorner.tn";

export const fakeUser = {
  firstName: "Khaled",
  lastName: "Bouajila",
  email: "khaled@example.com",
  phone: "+216 55 123 456",
  avatar: "https://i.pravatar.cc/200?img=12",
  address: "Rue du Lac Turkana, Les Berges du Lac 1",
  city: "Tunis",
  postalCode: "1053",
  points: 1240,
  ordersCount: 27,
  memberSince: "March 2026",
};

export const notifications: NotificationModel[] = [
  {
    id: 1,
    title: "Your order is on the way",
    body: "Order TK-2847 from Smash & Stack left the kitchen. ETA 12 min.",
    time: "5 min ago",
    type: "order",
    read: false,
  },
  {
    id: 2,
    title: "Free delivery this weekend",
    body: "All orders above $15 ship free until Sunday midnight.",
    time: "2h ago",
    type: "promo",
    read: false,
  },
  {
    id: 3,
    title: "Order TK-2831 is being prepared",
    body: "Luigi's Pizzeria is firing up your Margherita Classica.",
    time: "3h ago",
    type: "order",
    read: true,
  },
  {
    id: 4,
    title: "20% off pizza",
    body: "Use code NEWUSER at checkout. Valid on all pizzerias.",
    time: "Yesterday",
    type: "promo",
    read: true,
  },
  {
    id: 5,
    title: "Password changed",
    body: "Your password was updated successfully.",
    time: "3 days ago",
    type: "system",
    read: true,
  },
];

export const reels: ReelModel[] = [
  {
    id: 1,
    restaurantId: 1,
    productId: "classic-smash-burger",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    caption: "Double smash, double cheddar. This is how we do it. 🍔",
    likes: 2431,
    comments: 148,
  },
  {
    id: 2,
    restaurantId: 3,
    productId: "margherita-classica",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    caption: "Fresh out of the wood oven at 450°C 🔥🍕",
    likes: 1876,
    comments: 92,
  },
  {
    id: 3,
    restaurantId: 8,
    productId: "nutella-lava-cake",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    caption: "Watch the Nutella flow. Sound on. 🍫",
    likes: 5210,
    comments: 310,
  },
  {
    id: 4,
    restaurantId: 4,
    productId: "street-tacos-trio",
    video:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    caption: "Carne asada, salsa verde, lime. Taco Tuesday every day. 🌮",
    likes: 987,
    comments: 41,
  },
];

export const onboardingSlides = [
  {
    title: "Discover the best food",
    sub: "Browse hundreds of restaurants around you and find your next favourite meal.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  },
  {
    title: "Build it your way",
    sub: "Customize sizes, sauces and toppings. Save your combos for one-tap reorders.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  },
  {
    title: "Fast delivery to your door",
    sub: "Track your order live from the kitchen to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80",
  },
];

export const faqs = [
  {
    q: "How do I track my order?",
    a: "Open the Orders tab. Active orders show a live status from Pending to Delivered.",
  },
  {
    q: "Can I change an order after placing it?",
    a: "You can cancel within 2 minutes while the order is still Pending. After that, contact the restaurant.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "Cash on delivery and card at checkout. Wallet payments are coming soon.",
  },
  {
    q: "How do promo codes work?",
    a: "Enter the code in the cart. TACO10 gives 10% off, WELCOME gives $3 off your first order.",
  },
  {
    q: "What if an item is missing?",
    a: "Tap Help on the order and pick 'Missing item'. We refund or resend within the hour.",
  },
];
