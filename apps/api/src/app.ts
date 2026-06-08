import cors from "cors";
import express from "express";
import { cartRouter } from "./routes/cart.routes.js";
import { checkoutRouter } from "./routes/checkout.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { couponsRouter } from "./routes/coupons.routes.js";
import { devRouter } from "./routes/dev.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { AppError, errorHandler, notFoundHandler } from "./utils/errors.js";

export const createApp = () => {
  const app = express();
  const configuredOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
  const allowedOrigins = process.env.NODE_ENV === "production"
    ? [configuredOrigin]
    : [configuredOrigin, "http://localhost:3001"];
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());
  app.use((req, _res, next) => {
    // Fire only when the client sent bytes but express.json() skipped parsing (wrong/missing Content-Type)
    const contentLength = parseInt(req.headers["content-length"] ?? "0", 10);
    const hasBody = contentLength > 0 || !!req.headers["transfer-encoding"];
    if ((req.method === "POST" || req.method === "PATCH") && hasBody && req.body === undefined) {
      next(new AppError("MISSING_BODY", "Request body is required. Ensure Content-Type: application/json is set.", 400));
      return;
    }
    next();
  });
  app.use("/api/health", healthRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/checkout", checkoutRouter);
  app.use("/api/coupons", couponsRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/dev", devRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
