import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { generateDiscountCode, getAdminStats } from "../domain/ecommerce.service.js";

export const adminRouter = Router();

adminRouter.use(adminAuth);

adminRouter.post("/discount-codes", (_req, res) => {
  res.status(201).json({ message: "Discount code generated", coupon: generateDiscountCode() });
});

adminRouter.get("/stats", (_req, res) => {
  res.json({ stats: getAdminStats() });
});

