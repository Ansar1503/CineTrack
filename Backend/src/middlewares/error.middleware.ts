import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => {
      const field = issue.path.join(".");
      return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${
        issue.message
      }`;
    });

    return res.status(400).json({
      success: false,
      message: formattedErrors[0],
      errors: formattedErrors,
    });
  }

  if (err?.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
