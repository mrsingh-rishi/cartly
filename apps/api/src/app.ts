import cors from "cors";
import express from "express";
import { cartRouter } from "./routes/cart.routes.js";
import { checkoutRouter } from "./routes/checkout.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { devRouter } from "./routes/dev.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { errorHandler, notFoundHandler } from "./utils/errors.js";

export const createApp = () => {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" }));
  app.use(express.json());
  app.use("/api/health", healthRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/checkout", checkoutRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/dev", devRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
