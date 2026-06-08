import { checkoutSchema } from "@cartly/shared";
import { Router } from "express";
import { checkout } from "../domain/ecommerce.service.js";

export const checkoutRouter = Router();

checkoutRouter.post("/", (req, res) => {
  const input = checkoutSchema.parse(req.body);
  res.status(201).json({ message: "Order placed successfully", order: checkout(input.couponCode) });
});

