import { PRODUCTS } from "@cartly/shared";
import { Router } from "express";
import { toDecimal } from "../utils/money.js";

export const productsRouter = Router();

productsRouter.get("/", (_req, res) => {
  res.json({ products: PRODUCTS.map((product) => ({ ...product, price: toDecimal(product.priceCents) })) });
});

