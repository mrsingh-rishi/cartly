import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError("NOT_FOUND", "Route not found.", 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: error.issues[0]?.message ?? "Invalid request." } });
    return;
  }
  if (error instanceof AppError) {
    res.status(error.status).json({ error: { code: error.code, message: error.message } });
    return;
  }
  console.error(error);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
};

