import { Router } from "express";
import { generateDiscountCode, getAdminStats } from "../domain/ecommerce.service.js";

export const adminRouter = Router();

adminRouter.post("/discount-codes", (_req, res) => {
  res.status(201).json({ message: "Discount code generated", coupon: generateDiscountCode() });
});

adminRouter.get("/stats", (_req, res) => {
  res.json({ stats: getAdminStats() });
});

