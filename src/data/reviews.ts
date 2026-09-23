import type { ReviewModel } from "./models";

export const reviewsSeed: ReviewModel[] = [
  // ── Smash & Stack (restaurantId 1) ─────────────────────────────────────
  {
    id: 1,
    restaurantId: 1,
    authorName: "Mariem K.",
    rating: 5,
    comment:
      "Best smash burger in Tunis, hands down. The double patty with cheddar is unreal.",
    date: "2026-07-20",
    ownerReplyText:
      "Thank you so much, Mariem! We're thrilled you loved it — see you again soon!",
    ownerReplyDate: "2026-07-20T18:30:00",
  },
  {
    id: 2,
    restaurantId: 1,
    authorName: "Amine T.",
    rating: 4,
    comment: "Great burgers, fries could be a bit crispier but overall solid.",
    date: "2026-07-17",
  },
  {
    id: 3,
    restaurantId: 1,
    authorName: "Sarra B.",
    rating: 2,
    comment: "Order arrived cold and the fries were soggy this time.",
    date: "2026-07-14",
    ownerReplyText:
      "We're really sorry about this experience — this isn't the standard we hold ourselves to. We've flagged this with our delivery team and would love to make it right on your next order.",
    ownerReplyDate: "2026-07-14T20:10:00",
  },
  {
    id: 4,
    restaurantId: 1,
    authorName: "Yassine H.",
    rating: 5,
    comment: "The triple smash with bacon is a must-try. Worth every dinar.",
    date: "2026-07-09",
  },
  {
    id: 5,
    restaurantId: 1,
    authorName: "Nour E.",
    rating: 3,
    comment: "Decent but a bit pricey for the portion size.",
    date: "2026-06-30",
  },
  {
    id: 6,
    restaurantId: 1,
    authorName: "Wassim D.",
    rating: 4,
    comment: "Quick delivery, tasty burger, will order again.",
    date: "2026-06-22",
  },

  // ── Sushi Omakase (restaurantId 2) ─────────────────────────────────────
  {
    id: 7,
    restaurantId: 2,
    authorName: "Léa M.",
    rating: 5,
    comment:
      "Freshest sushi I've had outside Japan. The dragon roll is stunning.",
    date: "2026-07-21",
    ownerReplyText:
      "Arigatou gozaimasu, Léa! Our chef will be delighted to hear this — thank you for the kind words.",
    ownerReplyDate: "2026-07-21T21:05:00",
  },
  {
    id: 8,
    restaurantId: 2,
    authorName: "Karim S.",
    rating: 4,
    comment: "Lovely presentation, a bit slow on a busy Friday night.",
    date: "2026-07-12",
  },
  {
    id: 9,
    restaurantId: 2,
    authorName: "Ines R.",
    rating: 5,
    comment: "Omakase set was incredible, every piece was perfectly balanced.",
    date: "2026-07-03",
  },
  {
    id: 10,
    restaurantId: 2,
    authorName: "Omar F.",
    rating: 3,
    comment: "Good quality but portions felt small for the price.",
    date: "2026-06-25",
  },
  {
    id: 11,
    restaurantId: 2,
    authorName: "Salma J.",
    rating: 4,
    comment: "Spicy tuna roll was excellent, will be back for more.",
    date: "2026-06-15",
  },

  // ── Luigi's Pizzeria (restaurantId 3) ──────────────────────────────────
  {
    id: 12,
    restaurantId: 3,
    authorName: "Firas A.",
    rating: 5,
    comment: "That crust is everything — blistered, chewy, perfect.",
    date: "2026-07-19",
    ownerReplyText:
      "Grazie mille, Firas! We bake every pie with love — glad it shows.",
    ownerReplyDate: "2026-07-19T19:45:00",
  },
  {
    id: 13,
    restaurantId: 3,
    authorName: "Rania C.",
    rating: 2,
    comment: "Pizza was undercooked in the middle, disappointing for the price.",
    date: "2026-07-08",
    ownerReplyText:
      "So sorry to hear this, Rania — that shouldn't have left our kitchen. Please reach out so we can send you a fresh one on us.",
    ownerReplyDate: "2026-07-08T22:00:00",
  },
  {
    id: 14,
    restaurantId: 3,
    authorName: "Bilel N.",
    rating: 4,
    comment: "Margherita Classica is simple but done really well.",
    date: "2026-06-28",
  },
  {
    id: 15,
    restaurantId: 3,
    authorName: "Dorra L.",
    rating: 5,
    comment: "Family favorite, the kids ask for it every week!",
    date: "2026-06-18",
  },
  {
    id: 16,
    restaurantId: 3,
    authorName: "Hamza Z.",
    rating: 3,
    comment: "Good pizza, delivery took longer than the estimate.",
    date: "2026-06-05",
  },

  // ── Pasta Madre (restaurantId 6) ───────────────────────────────────────
  {
    id: 17,
    restaurantId: 6,
    authorName: "Emna O.",
    rating: 5,
    comment: "Cacio e pepe was silky and rich, tastes handmade.",
    date: "2026-07-16",
  },
  {
    id: 18,
    restaurantId: 6,
    authorName: "Anis P.",
    rating: 4,
    comment: "Cozy comfort food, portions are generous.",
    date: "2026-07-06",
  },
  {
    id: 19,
    restaurantId: 6,
    authorName: "Chaima V.",
    rating: 2,
    comment: "Pasta was overcooked and a bit bland tonight.",
    date: "2026-06-27",
  },
  {
    id: 20,
    restaurantId: 6,
    authorName: "Skander W.",
    rating: 5,
    comment: "Best Italian comfort food in the area, consistently great.",
    date: "2026-06-12",
  },
  {
    id: 21,
    restaurantId: 6,
    authorName: "Mouna Q.",
    rating: 4,
    comment: "Lovely sauces, would love more veggie options.",
    date: "2026-05-30",
  },
];

export function reviewsOf(restaurantId: number) {
  return reviewsSeed
    .filter((r) => r.restaurantId === restaurantId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
