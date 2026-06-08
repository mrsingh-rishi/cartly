import { Router } from "express";
import { resetStore } from "../domain/ecommerce.service.js";
import { AppError } from "../utils/errors.js";

export const devRouter = Router();

devRouter.post("/reset", (_req, res) => {
  if (process.env.NODE_ENV === "production") throw new AppError("NOT_FOUND", "Route not found.", 404);
  resetStore();
  res.json({ message: "Store reset" });
});

