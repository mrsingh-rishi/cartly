import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  PRODUCTS,
  SHIPPING_FEE_CENTS,
  type CartItem,
  type Coupon,
  type Order
} from "@cartly/shared";
import { store, resetStore } from "../store/memory-store.js";
import { AppError } from "../utils/errors.js";
import { toDecimal } from "../utils/money.js";

export const getProducts = () => PRODUCTS;
export const getCart = () => store.cart;
export { resetStore };

export const addItemToCart = (productId: string, quantity: number) => {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) throw new AppError("PRODUCT_NOT_FOUND", "Product not found.", 404);
  const existing = store.cart.find((item) => item.productId === productId);
  if (existing) existing.quantity += quantity;
  else store.cart.push({ productId: product.id, name: product.name, desc: product.desc, category: product.category, priceCents: product.priceCents, quantity });
  return getCartResponse();
};

export const updateCartItem = (productId: string, quantity: number) => {
  const item = requireCartItem(productId);
  item.quantity = quantity;
  return getCartResponse();
};

export const removeCartItem = (productId: string) => {
  requireCartItem(productId);
  store.cart = store.cart.filter((item) => item.productId !== productId);
  return getCartResponse();
};

export const calculateCartSummary = (items: CartItem[] = store.cart) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FEE_CENTS;
  return { itemCount, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
};

export const getCartResponse = () => {
  const summary = calculateCartSummary();
  return {
    items: store.cart.map((item) => ({
      ...item,
      price: toDecimal(item.priceCents),
      lineTotalCents: item.priceCents * item.quantity,
      lineTotal: toDecimal(item.priceCents * item.quantity)
    })),
    summary: {
      ...summary,
      subtotal: toDecimal(summary.subtotalCents),
      shipping: toDecimal(summary.shippingCents),
      total: toDecimal(summary.totalCents)
    }
  };
};

const requireCartItem = (productId: string) => {
  const item = store.cart.find((cartItem) => cartItem.productId === productId);
  if (!item) throw new AppError("CART_ITEM_NOT_FOUND", "Cart item not found.", 404);
  return item;
};

export const validateCoupon = (couponCode: string) => {
  const coupon = store.coupons.find((item) => item.code === couponCode.trim().toUpperCase());
  if (!coupon) throw new AppError("INVALID_COUPON", "Invalid coupon code.");
  if (coupon.status === "used") throw new AppError("COUPON_ALREADY_USED", "This coupon has already been used.");
  return coupon;
};

export const checkout = (couponCode?: string) => {
  if (store.cart.length === 0) throw new AppError("EMPTY_CART", "Cannot checkout with an empty cart.");
  const coupon = couponCode ? validateCoupon(couponCode) : undefined;
  const summary = calculateCartSummary();
  const discountCents = coupon ? Math.round(summary.subtotalCents * coupon.discountPercent / 100) : 0;
  const order: Order = {
    id: `ORD-${String(store.orders.length + 1).padStart(4, "0")}`,
    items: structuredClone(store.cart),
    subtotalCents: summary.subtotalCents,
    shippingCents: summary.shippingCents,
    discountCents,
    totalCents: summary.subtotalCents + summary.shippingCents - discountCents,
    couponCode: coupon?.code,
    createdAt: new Date().toISOString()
  };
  store.orders.push(order);
  if (coupon) markCouponUsed(coupon);
  store.cart = [];
  return serializeOrder(order);
};

const markCouponUsed = (coupon: Coupon) => {
  coupon.status = "used";
  coupon.usedAt = new Date().toISOString();
};

export const serializeOrder = (order: Order) => ({
  ...order,
  items: order.items.map((item) => ({ ...item, price: toDecimal(item.priceCents), lineTotalCents: item.priceCents * item.quantity, lineTotal: toDecimal(item.priceCents * item.quantity) })),
  subtotal: toDecimal(order.subtotalCents),
  shipping: toDecimal(order.shippingCents),
  discount: toDecimal(order.discountCents),
  total: toDecimal(order.totalCents)
});
