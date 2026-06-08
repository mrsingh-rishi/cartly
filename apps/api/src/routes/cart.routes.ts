import { addCartItemSchema, updateCartItemSchema } from "@cartly/shared";
import { Router } from "express";
import { addItemToCart, getCartResponse, removeCartItem, updateCartItem } from "../domain/ecommerce.service.js";

export const cartRouter = Router();

cartRouter.get("/", (_req, res) => res.json(getCartResponse()));

cartRouter.post("/items", (req, res) => {
  const input = addCartItemSchema.parse(req.body);
  res.status(201).json({ message: "Item added to cart", cart: addItemToCart(input.productId, input.quantity) });
});

cartRouter.patch("/items/:productId", (req, res) => {
  const input = updateCartItemSchema.parse(req.body);
  res.json({ message: "Cart item updated", cart: updateCartItem(req.params.productId, input.quantity) });
});

cartRouter.delete("/items/:productId", (req, res) => {
  res.json({ message: "Cart item removed", cart: removeCartItem(req.params.productId) });
});

