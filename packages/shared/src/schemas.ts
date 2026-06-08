import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive()
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1)
});

export const checkoutSchema = z.object({
  couponCode: z.string().trim().min(1).optional()
});

