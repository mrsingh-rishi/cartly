import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { errorHandler, notFoundHandler } from "./utils/errors.js";

export const createApp = () => {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" }));
  app.use(express.json());
  app.use("/api/health", healthRouter);
  app.use("/api/products", productsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

