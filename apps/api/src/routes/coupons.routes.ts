import { Router } from "express";
import { previewCoupon } from "../domain/ecommerce.service.js";

export const couponsRouter = Router();

couponsRouter.get("/preview", (req, res) => {
  const code = String(req.query.code ?? "").trim();
  if (!code) {
    res.status(400).json({ error: { code: "MISSING_CODE", message: "Query param 'code' is required." } });
    return;
  }
  res.json(previewCoupon(code));
});
