export type Product = {
  id: string;
  name: string;
  desc: string;
  priceCents: number;
  category: string;
};

export type CartItem = Omit<Product, "id"> & {
  productId: string;
  quantity: number;
};

export type Coupon = {
  code: string;
  discountPercent: number;
  status: "unused" | "used";
  generatedAfterOrder: number;
  createdAt: string;
  usedAt?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  couponCode?: string;
  createdAt: string;
};

export type AdminStats = {
  totalOrders: number;
  totalItemsPurchased: number;
  totalRevenueCents: number;
  discountCodesGenerated: number;
  totalDiscountsGivenCents: number;
  coupons: Coupon[];
};

export type StoreState = {
  cart: CartItem[];
  orders: Order[];
  coupons: Coupon[];
  generatedMilestones: number[];
};

