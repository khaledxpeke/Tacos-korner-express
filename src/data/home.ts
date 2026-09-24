import type {
  CategoryModel,
  ProductModel,
  PromoModel,
  RestaurantModel,
} from "./models";
import { slug } from "@/lib/utils";

export const categories: CategoryModel[] = [
  { name: "Burgers", icon: "🍔", color: "#FFF0F0" },
  { name: "Pizza", icon: "🍕", color: "#FFF5E6" },
  { name: "Tacos", icon: "🌮", color: "#ECFDF5" },
  { name: "Sushi", icon: "🍣", color: "#EFF6FF" },
  { name: "Pasta", icon: "🍝", color: "#F3E8FF" },
  { name: "Desserts", icon: "🍰", color: "#FFF0F0" },
  { name: "Drinks", icon: "🥤", color: "#EAF2FB" },
  { name: "Chicken", icon: "🍗", color: "#FFF5E6" },
];

export const restaurants: RestaurantModel[] = [
  {
    id: 1,
    name: "Smash & Stack",
    cuisine: "Burgers · American",
    description:
      "Double-smashed patties, melty cheddar, and house sauce. The burger joint Tunis talks about.",
    rating: 4.8,
    reviews: 534,
    deliveryTime: "15–25 min",
    deliveryFee: 0.99,
    zone: "Lac 1",
    isOpen: true,
    openTime: "11:00 AM",
    closeTime: "11:00 PM",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80",
    lat: 36.8321,
    lng: 10.2312,
    address: "Rue du Lac Turkana, Les Berges du Lac 1, Tunis",
    phone: "+216 71 234 501",
  },
  {
    id: 2,
    name: "Sushi Omakase",
    cuisine: "Sushi · Japanese",
    description:
      "Chef-led omakase rolls with fish flown in fresh. Precision, balance, and a touch of theatre.",
    rating: 4.9,
    reviews: 412,
    deliveryTime: "30–45 min",
    deliveryFee: 2.49,
    zone: "Lac 1",
    isOpen: true,
    openTime: "11:30 AM",
    closeTime: "10:30 PM",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
    lat: 36.8375,
    lng: 10.2408,
    address: "Rue du Lac Léman, Les Berges du Lac 1, Tunis",
    phone: "+216 71 234 502",
  },
  {
    id: 3,
    name: "Luigi's Pizzeria",
    cuisine: "Pizza · Italian",
    description:
      "Wood-fired Neapolitan pies with a blistered crust, made the way Nonna taught us.",
    rating: 4.7,
    reviews: 721,
    deliveryTime: "25–35 min",
    deliveryFee: 0,
    zone: "Lac 2",
    isOpen: true,
    openTime: "11:00 AM",
    closeTime: "11:30 PM",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    lat: 36.8447,
    lng: 10.265,
    address: "Rue du Lac Malaren, Les Berges du Lac 2, Tunis",
    phone: "+216 71 234 503",
  },
  {
    id: 4,
    name: "Taco Loco",
    cuisine: "Tacos · Mexican",
    offersDelivery: false,
    description:
      "Street-style tacos loaded with charred meats, bright salsas, and fresh-pressed lime.",
    rating: 4.6,
    reviews: 309,
    deliveryTime: "15–25 min",
    deliveryFee: 1.49,
    zone: "La Marsa",
    isOpen: true,
    openTime: "11:00 AM",
    closeTime: "12:00 AM",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
    lat: 36.8782,
    lng: 10.3247,
    address: "Avenue Habib Bourguiba, La Marsa, Tunis",
    phone: "+216 71 234 504",
  },
  {
    id: 5,
    name: "Green Bowl",
    cuisine: "Salads · Healthy",
    description:
      "Crisp, colorful salads and grain bowls built for people who actually want to feel good after lunch.",
    rating: 4.5,
    reviews: 198,
    deliveryTime: "20–30 min",
    deliveryFee: 1.99,
    zone: "Carthage",
    isOpen: true,
    openTime: "09:00 AM",
    closeTime: "09:00 PM",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    lat: 36.8528,
    lng: 10.3233,
    address: "Rue de Carthage, Carthage, Tunis",
    phone: "+216 71 234 505",
  },
  {
    id: 6,
    name: "Pasta Madre",
    cuisine: "Pasta · Italian",
    description:
      "Handmade pasta, slow sauces, and the kind of comfort only real Italian cooking delivers.",
    rating: 4.8,
    reviews: 445,
    deliveryTime: "30–40 min",
    deliveryFee: 2.99,
    zone: "Sidi Bou Said",
    isOpen: false,
    openTime: "12:00 PM",
    closeTime: "10:00 PM",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
    lat: 36.8703,
    lng: 10.3418,
    address: "Rue Sidi Bou Said, Sidi Bou Said, Tunis",
    phone: "+216 71 234 506",
  },
  {
    id: 7,
    name: "The Fried Chicken House",
    cuisine: "Chicken · American",
    description:
      "Buttermilk-brined, double-fried chicken with a shatteringly crisp crust.",
    rating: 4.7,
    reviews: 376,
    deliveryTime: "20–30 min",
    deliveryFee: 1.49,
    zone: "Ariana",
    isOpen: true,
    openTime: "10:30 AM",
    closeTime: "11:00 PM",
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80",
    lat: 36.8625,
    lng: 10.1956,
    address: "Avenue Ennasr, Ariana, Tunis",
    phone: "+216 71 234 507",
  },
  {
    id: 8,
    name: "Dessert Lab",
    cuisine: "Desserts · Café",
    offersDelivery: false,
    description:
      "Playful, Instagram-worthy desserts crafted daily — lava cakes, tarts, and small-batch ice cream.",
    rating: 4.9,
    reviews: 612,
    deliveryTime: "15–20 min",
    deliveryFee: 0.99,
    zone: "Le Bardo",
    isOpen: true,
    openTime: "09:00 AM",
    closeTime: "10:00 PM",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    lat: 36.8092,
    lng: 10.1397,
    address: "Rue du Bardo, Le Bardo, Tunis",
    phone: "+216 71 234 508",
  },
  {
    id: 9,
    name: "Dragon Wok",
    cuisine: "Asian · Fusion",
    description:
      "Wok-fired Asian fusion classics with bold sauces and fast, fragrant cooking.",
    rating: 4.6,
    reviews: 271,
    deliveryTime: "25–35 min",
    deliveryFee: 2.99,
    zone: "Menzah",
    isOpen: true,
    openTime: "11:00 AM",
    closeTime: "11:00 PM",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80",
    lat: 36.8397,
    lng: 10.1608,
    address: "Avenue Fattouma Bourguiba, El Menzah, Tunis",
    phone: "+216 71 234 509",
  },
  {
    id: 10,
    name: "The Juice Bar",
    cuisine: "Drinks · Healthy",
    offersDelivery: false,
    description:
      "Cold-pressed juices and smoothies made from fruit sourced fresh every morning.",
    rating: 4.5,
    reviews: 152,
    deliveryTime: "10–15 min",
    deliveryFee: 0,
    zone: "Ennasr",
    isOpen: true,
    openTime: "07:00 AM",
    closeTime: "08:00 PM",
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80",
    lat: 36.8508,
    lng: 10.178,
    address: "Rue du Lac Constance, Ennasr, Tunis",
    phone: "+216 71 234 510",
  },
  {
    id: 11,
    name: "Baja Fish Shack",
    cuisine: "Seafood · Mexican",
    description:
      "Beach-shack seafood — crispy battered fish, bright slaws, and zesty crema, Baja style.",
    rating: 4.6,
    reviews: 218,
    deliveryTime: "20–30 min",
    deliveryFee: 1.99,
    zone: "Manar",
    isOpen: true,
    openTime: "11:00 AM",
    closeTime: "10:30 PM",
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80",
    lat: 36.8324,
    lng: 10.15,
    address: "Avenue de la Bourse, El Manar, Tunis",
    phone: "+216 71 234 511",
  },
  {
    id: 12,
    name: "Truffle & Co.",
    cuisine: "Gourmet · American",
    description:
      "Elevated American comfort food finished with truffle, for when you want dinner to feel like an occasion.",
    rating: 4.8,
    reviews: 389,
    deliveryTime: "35–50 min",
    deliveryFee: 3.49,
    zone: "Tunis-Carthage Airport",
    isOpen: false,
    openTime: "06:00 PM",
    closeTime: "01:00 AM",
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=80",
    lat: 36.851,
    lng: 10.2272,
    address: "Route de l'Aéroport, Tunis-Carthage, Tunis",
    phone: "+216 71 234 512",
  },
];

type ProductInput = Omit<
  ProductModel,
  "id" | "allergens" | "isCustomizable" | "types"
> & {
  allergens?: string[];
  isCustomizable?: boolean;
  types?: ProductModel["types"];
};

function product(p: ProductInput): ProductModel {
  return {
    ...p,
    id: slug(p.name),
    allergens: p.allergens ?? [],
    isCustomizable: p.isCustomizable ?? false,
    types: p.types ?? [],
  };
}

export const products: ProductModel[] = [
  // ── Burgers (customizable) ─────────────────────────────────────────────
  product({
    name: "Classic Smash Burger",
    description:
      "Juicy double smash patty with cheddar, pickles, and our secret sauce.",
    price: 12.99,
    rating: 4.8,
    reviews: 234,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    category: "Burgers",
    restaurantId: 1,
    allergens: ["Gluten", "Dairy"],
    isCustomizable: true,
    types: [
      {
        id: "burger-size",
        name: "Choose Size",
        message: "Select one size",
        min: 1,
        max: 1,
        options: [
          { id: "size-single", name: "Single", price: 0 },
          { id: "size-double", name: "Double", price: 2.5 },
          { id: "size-triple", name: "Triple", price: 4.5 },
        ],
      },
      {
        id: "burger-sauce",
        name: "Choose Sauce",
        message: "Pick your favourite",
        min: 1,
        max: 1,
        options: [
          { id: "sauce-secret", name: "Secret Sauce", price: 0 },
          { id: "sauce-bbq", name: "BBQ", price: 0 },
          { id: "sauce-chipotle", name: "Chipotle", price: 0 },
          { id: "sauce-mustard", name: "Mustard", price: 0 },
        ],
      },
      {
        id: "burger-toppings",
        name: "Add Toppings",
        message: "Up to 4 extras",
        min: 0,
        max: 4,
        options: [
          { id: "top-cheese", name: "Cheddar", price: 0.8 },
          { id: "top-bacon", name: "Bacon", price: 1.5 },
          { id: "top-jalapen", name: "Jalapeños", price: 0.5 },
          { id: "top-avocado", name: "Avocado", price: 1.2 },
          { id: "top-egg", name: "Fried Egg", price: 1.0 },
          { id: "top-mushroom", name: "Mushrooms", price: 0.8 },
          { id: "top-onion", name: "Caramelised Onion", price: 0.6 },
        ],
      },
    ],
  }),
  product({
    name: "Spicy Chipotle Burger",
    description: "Fiery chipotle aioli, pepper jack cheese, and jalapeños.",
    price: 13.5,
    rating: 4.7,
    reviews: 187,
    isNew: false,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&q=80",
    category: "Burgers",
    restaurantId: 1,
    allergens: ["Gluten", "Dairy"],
    isCustomizable: true,
    types: [
      {
        id: "chipotle-size",
        name: "Choose Size",
        message: "Select one size",
        min: 1,
        max: 1,
        options: [
          { id: "csize-single", name: "Single", price: 0 },
          { id: "csize-double", name: "Double", price: 2.5 },
        ],
      },
      {
        id: "chipotle-heat",
        name: "Spice Level",
        message: "How hot can you go?",
        min: 1,
        max: 1,
        options: [
          { id: "heat-mild", name: "Mild", price: 0 },
          { id: "heat-medium", name: "Medium", price: 0 },
          { id: "heat-hot", name: "Hot 🔥", price: 0 },
          { id: "heat-xhot", name: "Extra Hot 🔥🔥", price: 0 },
        ],
      },
      {
        id: "chipotle-extras",
        name: "Add Extras",
        message: "Optional add-ons",
        min: 0,
        max: 3,
        options: [
          { id: "cex-cheese", name: "Pepper Jack", price: 0.8 },
          { id: "cex-bacon", name: "Bacon", price: 1.5 },
          { id: "cex-guac", name: "Guacamole", price: 1.2 },
          { id: "cex-jalap", name: "Extra Jalapeños", price: 0.5 },
        ],
      },
    ],
  }),

  // ── Pizza (customizable) ───────────────────────────────────────────────
  product({
    name: "Margherita Classica",
    description:
      "San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil.",
    price: 14.0,
    rating: 4.9,
    reviews: 412,
    isNew: false,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80",
    category: "Pizza",
    restaurantId: 3,
    allergens: ["Gluten", "Dairy"],
    isCustomizable: true,
    types: [
      {
        id: "marg-crust",
        name: "Choose Crust",
        message: "Select your base",
        min: 1,
        max: 1,
        options: [
          { id: "crust-thin", name: "Thin Crust", price: 0 },
          { id: "crust-classic", name: "Classic", price: 0 },
          { id: "crust-thick", name: "Thick Crust", price: 1.0 },
          { id: "crust-stuffed", name: "Stuffed Crust", price: 2.5 },
        ],
      },
      {
        id: "marg-sauce",
        name: "Sauce",
        message: "Base sauce",
        min: 1,
        max: 1,
        options: [
          { id: "psauce-tomato", name: "Tomato", price: 0 },
          { id: "psauce-white", name: "White Cream", price: 0 },
          { id: "psauce-pesto", name: "Pesto", price: 0.5 },
        ],
      },
      {
        id: "marg-toppings",
        name: "Choose Toppings",
        message: "Pick up to 5",
        min: 0,
        max: 5,
        options: [
          { id: "pt-pineapple", name: "Pineapple", price: 0.8 },
          { id: "pt-jalapeno", name: "Jalapeños", price: 0.5 },
          { id: "pt-sweetcorn", name: "Sweet Corn", price: 0.5 },
          { id: "pt-pepperoni", name: "Pepperoni", price: 1.2 },
          { id: "pt-redonion", name: "Red Onions", price: 0.5 },
          { id: "pt-anchovies", name: "Anchovies", price: 1.0 },
          { id: "pt-groundbeef", name: "Ground Beef", price: 1.5 },
          { id: "pt-chicken", name: "Chicken Tikka", price: 1.5 },
          { id: "pt-mushroom", name: "Mushroom", price: 0.8 },
          { id: "pt-tuna", name: "Tuna", price: 1.0 },
        ],
      },
    ],
  }),
  product({
    name: "BBQ Pulled Pork Pizza",
    description: "Slow-cooked pulled pork, BBQ sauce, red onion, and cheddar.",
    price: 16.5,
    rating: 4.6,
    reviews: 156,
    isNew: true,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&q=80",
    category: "Pizza",
    restaurantId: 3,
    allergens: ["Gluten", "Dairy"],
    isCustomizable: true,
    types: [
      {
        id: "bbqp-crust",
        name: "Choose Crust",
        message: "Select your base",
        min: 1,
        max: 1,
        options: [
          { id: "bbqcrust-thin", name: "Thin Crust", price: 0 },
          { id: "bbqcrust-classic", name: "Classic", price: 0 },
          { id: "bbqcrust-thick", name: "Thick Crust", price: 1.0 },
        ],
      },
      {
        id: "bbqp-extras",
        name: "Add Extras",
        message: "Optional add-ons",
        min: 0,
        max: 3,
        options: [
          { id: "bbqex-cheese", name: "Extra Cheese", price: 1.0 },
          { id: "bbqex-jalapeno", name: "Jalapeños", price: 0.5 },
          { id: "bbqex-onion", name: "Caramelised Onion", price: 0.6 },
          { id: "bbqex-pepperoni", name: "Pepperoni", price: 1.2 },
        ],
      },
    ],
  }),

  // ── Tacos (customizable) ───────────────────────────────────────────────
  product({
    name: "Street Tacos Trio",
    description:
      "Three soft corn tortillas with carne asada, cilantro, and salsa.",
    price: 11.99,
    rating: 4.7,
    reviews: 203,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80",
    category: "Tacos",
    restaurantId: 4,
    isCustomizable: true,
    types: [
      {
        id: "taco-protein",
        name: "Choose Protein",
        message: "Required",
        min: 1,
        max: 1,
        options: [
          { id: "tpro-asada", name: "Carne Asada", price: 0 },
          { id: "tpro-chicken", name: "Grilled Chicken", price: 0 },
          { id: "tpro-shrimp", name: "Shrimp", price: 1.5 },
          { id: "tpro-veg", name: "Vegan", price: 0 },
        ],
      },
      {
        id: "taco-salsa",
        name: "Salsa",
        message: "Pick your salsa",
        min: 1,
        max: 1,
        options: [
          { id: "tsal-verde", name: "Salsa Verde", price: 0 },
          { id: "tsal-roja", name: "Salsa Roja", price: 0 },
          { id: "tsal-habanero", name: "Habanero 🔥", price: 0 },
        ],
      },
      {
        id: "taco-extras",
        name: "Extras",
        message: "Optional add-ons",
        min: 0,
        max: 4,
        options: [
          { id: "tex-guac", name: "Guacamole", price: 1.0 },
          { id: "tex-sour", name: "Sour Cream", price: 0.6 },
          { id: "tex-cheese", name: "Queso Fresco", price: 0.8 },
          { id: "tex-pico", name: "Pico de Gallo", price: 0.5 },
        ],
      },
    ],
  }),
  product({
    name: "Fish Tacos Baja Style",
    description: "Crispy battered cod, slaw, chipotle crema, lime.",
    price: 13.0,
    rating: 4.6,
    reviews: 142,
    isNew: true,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&q=80",
    category: "Tacos",
    restaurantId: 11,
    allergens: ["Fish", "Gluten"],
    isCustomizable: true,
    types: [
      {
        id: "fish-sauce",
        name: "Sauce",
        message: "Choose your sauce",
        min: 1,
        max: 1,
        options: [
          { id: "fsauce-chipotle", name: "Chipotle Crema", price: 0 },
          { id: "fsauce-tartar", name: "Tartar Sauce", price: 0 },
          { id: "fsauce-mango", name: "Mango Salsa", price: 0.5 },
        ],
      },
      {
        id: "fish-extras",
        name: "Add Extras",
        message: "Optional",
        min: 0,
        max: 3,
        options: [
          { id: "fex-avocado", name: "Avocado", price: 1.2 },
          { id: "fex-jalap", name: "Jalapeños", price: 0.5 },
          { id: "fex-cheese", name: "Cotija Cheese", price: 0.8 },
        ],
      },
    ],
  }),

  // ── Sushi (direct add) ─────────────────────────────────────────────────
  product({
    name: "Spicy Tuna Roll (8pc)",
    description: "Fresh tuna, spicy mayo, cucumber, avocado, sesame.",
    price: 18.0,
    rating: 4.9,
    reviews: 321,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80",
    category: "Sushi",
    restaurantId: 2,
    allergens: ["Fish", "Soy"],
  }),
  product({
    name: "Dragon Roll (8pc)",
    description: "Shrimp tempura topped with avocado and eel sauce.",
    price: 19.5,
    rating: 4.8,
    reviews: 298,
    isNew: false,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&q=80",
    category: "Sushi",
    restaurantId: 2,
    allergens: ["Shellfish", "Fish"],
  }),
  product({
    name: "Salmon Nigiri (2pc)",
    description: "Hand-pressed rice with fresh Atlantic salmon.",
    price: 8.5,
    rating: 4.8,
    reviews: 176,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&q=80",
    category: "Sushi",
    restaurantId: 2,
    allergens: ["Fish"],
  }),
  product({
    name: "Edamame",
    description: "Steamed soybeans with sea salt.",
    price: 4.5,
    rating: 4.4,
    reviews: 64,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=300&q=80",
    category: "Sides",
    restaurantId: 2,
    allergens: ["Soy"],
  }),
  product({
    name: "Iced Matcha",
    description: "Ceremonial matcha shaken over ice.",
    price: 5.0,
    rating: 4.6,
    reviews: 81,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=300&q=80",
    category: "Drinks",
    restaurantId: 2,
    allergens: [],
  }),

  // ── Pasta (direct add) ─────────────────────────────────────────────────
  product({
    name: "Cacio e Pepe",
    description:
      "Roman classic — spaghetti, Pecorino Romano, and black pepper.",
    price: 15.0,
    rating: 4.9,
    reviews: 389,
    isNew: false,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80",
    category: "Pasta",
    restaurantId: 6,
    allergens: ["Gluten", "Dairy"],
  }),

  // ── Desserts (direct add) ──────────────────────────────────────────────
  product({
    name: "Nutella Lava Cake",
    description:
      "Warm chocolate cake with a molten Nutella center. Served with vanilla ice cream.",
    price: 8.5,
    rating: 4.9,
    reviews: 501,
    isNew: false,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80",
    category: "Desserts",
    restaurantId: 8,
    allergens: ["Gluten", "Dairy", "Nuts", "Egg"],
  }),

  // ── Drinks (direct add) ────────────────────────────────────────────────
  product({
    name: "Mango Lassi",
    description:
      "Creamy mango and yogurt blended drink with a hint of cardamom.",
    price: 5.5,
    rating: 4.8,
    reviews: 178,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&q=80",
    category: "Drinks",
    restaurantId: 10,
    allergens: ["Dairy"],
  }),

  // ── Chicken (direct add) ───────────────────────────────────────────────
  product({
    name: "Nashville Hot Tenders",
    description:
      "Crispy tenders dipped in Nashville cayenne butter. Hot, hotter, hottest.",
    price: 14.5,
    rating: 4.7,
    reviews: 267,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&q=80",
    category: "Chicken",
    restaurantId: 7,
    allergens: ["Gluten"],
  }),

  product({
    name: "Crispy Smash Fries",
    description: "Hand-cut fries, parmesan, and house smash seasoning.",
    price: 4.5,
    rating: 4.6,
    reviews: 142,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80",
    category: "Sides",
    restaurantId: 1,
    allergens: ["Dairy"],
  }),
  product({
    name: "Chocolate Milkshake",
    description: "Thick vanilla ice cream blended with Belgian chocolate.",
    price: 5.5,
    rating: 4.8,
    reviews: 96,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80",
    category: "Drinks",
    restaurantId: 1,
    allergens: ["Dairy"],
  }),
  product({
    name: "Miso Soup",
    description: "Hot dashi, tofu, wakame, and spring onion.",
    price: 4.0,
    rating: 4.5,
    reviews: 88,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&q=80",
    category: "Sides",
    restaurantId: 2,
    allergens: ["Soy"],
  }),
  product({
    name: "Garlic Knots",
    description: "Baked knots, garlic butter, and parsley.",
    price: 5.0,
    rating: 4.6,
    reviews: 120,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80",
    category: "Sides",
    restaurantId: 3,
    allergens: ["Gluten", "Dairy"],
  }),
  product({
    name: "House Limonata",
    description: "Fresh lemon, sparkling water, and a hint of mint.",
    price: 3.5,
    rating: 4.5,
    reviews: 74,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425316c80?w=300&q=80",
    category: "Drinks",
    restaurantId: 3,
    allergens: [],
  }),
  product({
    name: "Elote Street Corn",
    description: "Charred corn, cotija, chili-lime mayo, and cilantro.",
    price: 5.5,
    rating: 4.7,
    reviews: 91,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&q=80",
    category: "Sides",
    restaurantId: 4,
    allergens: ["Dairy"],
  }),
  product({
    name: "Horchata",
    description: "Rice milk, cinnamon, and vanilla, served over ice.",
    price: 3.5,
    rating: 4.6,
    reviews: 58,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&q=80",
    category: "Drinks",
    restaurantId: 4,
    allergens: [],
  }),
  product({
    name: "Harvest Grain Bowl",
    description: "Quinoa, roasted veg, avocado, and lemon-tahini dressing.",
    price: 13.5,
    rating: 4.6,
    reviews: 154,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
    category: "Sides",
    restaurantId: 5,
    allergens: ["Sesame"],
  }),
  product({
    name: "Chicken Caesar Bowl",
    description: "Grilled chicken, romaine, parmesan, and house Caesar.",
    price: 14.0,
    rating: 4.5,
    reviews: 112,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&q=80",
    category: "Chicken",
    restaurantId: 5,
    allergens: ["Dairy", "Egg", "Gluten"],
  }),
  product({
    name: "Green Detox Juice",
    description: "Kale, apple, cucumber, and ginger.",
    price: 5.0,
    rating: 4.4,
    reviews: 67,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&q=80",
    category: "Drinks",
    restaurantId: 5,
    allergens: [],
  }),
  product({
    name: "Tagliatelle Bolognese",
    description: "Slow-cooked beef ragù, fresh tagliatelle, parmesan.",
    price: 16.5,
    rating: 4.8,
    reviews: 210,
    isNew: false,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80",
    category: "Pasta",
    restaurantId: 6,
    allergens: ["Gluten", "Dairy"],
  }),
  product({
    name: "Garlic Focaccia",
    description: "Warm focaccia, rosemary, and extra virgin olive oil.",
    price: 4.5,
    rating: 4.6,
    reviews: 83,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
    category: "Sides",
    restaurantId: 6,
    allergens: ["Gluten"],
  }),
  product({
    name: "San Pellegrino",
    description: "Chilled sparkling water.",
    price: 2.5,
    rating: 4.3,
    reviews: 40,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425316c80?w=300&q=80",
    category: "Drinks",
    restaurantId: 6,
    allergens: [],
  }),
  product({
    name: "Crispy Chicken Slaw",
    description: "Buttermilk slaw and house pickles on the side.",
    price: 4.0,
    rating: 4.5,
    reviews: 77,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80",
    category: "Sides",
    restaurantId: 7,
    allergens: [],
  }),
  product({
    name: "Classic Cola",
    description: "Ice-cold fountain cola.",
    price: 2.0,
    rating: 4.2,
    reviews: 51,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425316c80?w=300&q=80",
    category: "Drinks",
    restaurantId: 7,
    allergens: [],
  }),
  product({
    name: "Berry Cheesecake",
    description: "Baked cheesecake with a berry compote.",
    price: 7.5,
    rating: 4.8,
    reviews: 188,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&q=80",
    category: "Desserts",
    restaurantId: 8,
    allergens: ["Dairy", "Gluten", "Egg"],
  }),
  product({
    name: "Vanilla Soft Serve",
    description: "Small-batch vanilla, waffle cone optional.",
    price: 4.5,
    rating: 4.7,
    reviews: 134,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80",
    category: "Desserts",
    restaurantId: 8,
    allergens: ["Dairy"],
  }),
  product({
    name: "Iced Coffee",
    description: "Cold brew over ice with a splash of milk.",
    price: 3.5,
    rating: 4.5,
    reviews: 96,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80",
    category: "Drinks",
    restaurantId: 8,
    allergens: ["Dairy"],
  }),
  product({
    name: "Pad Thai",
    description: "Rice noodles, tamarind, egg, peanuts, and lime.",
    price: 14.5,
    rating: 4.7,
    reviews: 201,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&q=80",
    category: "Chicken",
    restaurantId: 9,
    allergens: ["Egg", "Nuts", "Fish"],
  }),
  product({
    name: "Vegetable Spring Rolls",
    description: "Crisp rolls with sweet chili sauce.",
    price: 5.5,
    rating: 4.5,
    reviews: 88,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80",
    category: "Sides",
    restaurantId: 9,
    allergens: ["Gluten"],
  }),
  product({
    name: "Thai Iced Tea",
    description: "Sweet condensed-milk tea over crushed ice.",
    price: 4.0,
    rating: 4.6,
    reviews: 73,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80",
    category: "Drinks",
    restaurantId: 9,
    allergens: ["Dairy"],
  }),
  product({
    name: "Strawberry Smoothie",
    description: "Strawberry, banana, and oat milk.",
    price: 6.0,
    rating: 4.6,
    reviews: 82,
    isNew: true,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80",
    category: "Drinks",
    restaurantId: 10,
    allergens: [],
  }),
  product({
    name: "Energy Bites",
    description: "Dates, oats, and peanut butter.",
    price: 4.0,
    rating: 4.4,
    reviews: 39,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&q=80",
    category: "Desserts",
    restaurantId: 10,
    allergens: ["Nuts", "Gluten"],
  }),
  product({
    name: "Baja Slaw",
    description: "Cabbage, lime crema, and pickled onion.",
    price: 3.5,
    rating: 4.4,
    reviews: 46,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
    category: "Sides",
    restaurantId: 11,
    allergens: ["Dairy"],
  }),
  product({
    name: "Agua Fresca",
    description: "Watermelon and lime, lightly sweetened.",
    price: 3.5,
    rating: 4.5,
    reviews: 52,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425316c80?w=300&q=80",
    category: "Drinks",
    restaurantId: 11,
    allergens: [],
  }),
  product({
    name: "Truffle Smash Burger",
    description: "Double smash, truffle aioli, aged cheddar, and arugula.",
    price: 18.5,
    rating: 4.9,
    reviews: 164,
    isNew: true,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    category: "Burgers",
    restaurantId: 12,
    allergens: ["Gluten", "Dairy"],
    isCustomizable: true,
    types: [
      {
        id: "truffle-size",
        name: "Choose Size",
        message: "Select one size",
        min: 1,
        max: 1,
        options: [
          { id: "tr-single", name: "Single", price: 0 },
          { id: "tr-double", name: "Double", price: 3 },
        ],
      },
    ],
  }),
  product({
    name: "Truffle Fries",
    description: "Hand-cut fries, truffle oil, and parmesan.",
    price: 7.5,
    rating: 4.8,
    reviews: 121,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80",
    category: "Sides",
    restaurantId: 12,
    allergens: ["Dairy"],
  }),
  product({
    name: "Sparkling Elderflower",
    description: "Elderflower cordial and soda.",
    price: 4.5,
    rating: 4.5,
    reviews: 48,
    isNew: false,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425316c80?w=300&q=80",
    category: "Drinks",
    restaurantId: 12,
    allergens: [],
  }),
];

export const maxProductPrice = Math.max(...products.map((p) => p.price));

export const promos: PromoModel[] = [
  {
    title: "Free Delivery",
    sub: "All orders this weekend",
    color: "#EC1D23",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    cta: "Browse kitchens",
    href: "/see-all?kind=restaurants",
  },
  {
    title: "10% Off Your Order",
    sub: "Use code TACO10 at checkout",
    color: "#2596BE",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    cta: "Copy TACO10",
    href: "/search?category=Pizza",
    code: "TACO10",
  },
  {
    title: "$3 Off Welcome",
    sub: "Use code WELCOME on your first basket",
    color: "#F59E0B",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    cta: "Copy WELCOME",
    href: "/home",
    code: "WELCOME",
  },
];

export const allergenOptions = [
  "Gluten",
  "Dairy",
  "Nuts",
  "Egg",
  "Fish",
  "Shellfish",
  "Soy",
  "Sesame",
];

export function restaurantOf(p: ProductModel): RestaurantModel {
  return restaurants.find((r) => r.id === p.restaurantId) ?? restaurants[0];
}

export function restaurantById(id: number | string) {
  return restaurants.find((r) => r.id === Number(id));
}

export function productById(id: string) {
  return products.find((p) => p.id === id);
}

export function productByName(name: string) {
  return products.find((p) => p.name === name);
}

export function productsOfRestaurant(restaurantId: number) {
  return products.filter((p) => p.restaurantId === restaurantId);
}

export const newProducts = products.filter((p) => p.isNew);
export const popularProducts = products.filter((p) => p.isFeatured);
