import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  PRODUCTS,
  SHIPPING_FEE_CENTS,
  type CartItem
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

