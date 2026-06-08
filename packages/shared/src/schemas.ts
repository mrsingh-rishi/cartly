import { z } from "zod";
import { MAX_ITEM_QUANTITY } from "./constants.js";

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(MAX_ITEM_QUANTITY)
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY)
});

export const checkoutSchema = z.object({
  couponCode: z.string().trim().min(1).optional()
});

