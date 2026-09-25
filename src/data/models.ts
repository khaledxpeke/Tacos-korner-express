export interface CategoryModel {
  name: string;
  icon: string;
  color: string;
}

export interface RestaurantModel {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  /** Omitted or true means the kitchen delivers. False is pickup only. */
  offersDelivery?: boolean;
  zone: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  image: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
}

export interface IngredientModel {
  id: string;
  name: string;
  price: number;
}

export interface ProductTypeModel {
  id: string;
  name: string;
  message: string;
  min: number;
  max: number;
  options: IngredientModel[];
}

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  isFeatured: boolean;
  image: string;
  category: string;
  restaurantId: number;
  allergens: string[];
  isCustomizable: boolean;
  types: ProductTypeModel[];
}

export interface PromoModel {
  title: string;
  sub: string;
  color: string;
  image: string;
  cta: string;
  href?: string;
  code?: string;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "onTheWay"
  | "delivered"
  | "cancelled";

export interface OrderLineItem {
  name: string;
  quantity: number;
  imageUrl: string;
  /** Chosen size, sauce, toppings, or the ingredients in the dish. */
  selections?: { label: string; value: string }[];
}

export interface OrderModel {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderLineItem[];
  total: number;
  status: OrderStatus;
  date: string;
}

export interface ReviewModel {
  id: number;
  restaurantId: number;
  authorName: string;
  rating: number;
  comment: string;
  date: string; // ISO
  ownerReplyText?: string;
  ownerReplyDate?: string; // ISO
}

export interface CartCustomization {
  typeId: string;
  typeName: string;
  selected: IngredientModel[];
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantName: string;
  quantity: number;
  customizations: CartCustomization[];
}

export interface NotificationModel {
  id: number;
  title: string;
  body: string;
  time: string;
  type: "order" | "promo" | "system";
  read: boolean;
}

export interface ReelModel {
  id: number;
  restaurantId: number;
  productId?: string;
  video: string;
  poster: string;
  caption: string;
  likes: number;
  comments: number;
}
