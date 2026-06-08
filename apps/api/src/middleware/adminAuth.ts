import type { RequestHandler } from "express";
import { AppError } from "../utils/errors.js";

export const adminAuth: RequestHandler = (req, _res, next) => {
  const key = process.env.ADMIN_API_KEY ?? "dev-admin-key";
  if (req.headers["x-admin-key"] !== key) {
    next(new AppError("UNAUTHORIZED", "Admin access requires a valid API key.", 401));
    return;
  }
  next();
};
