import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { TErrorSources } from "../interfaces/error.types";
import { StatusCodes } from "http-status-codes";
import { handlerDuplicateErr } from "../helpers/handleDuplicateErr";
import { handleCastErr } from "../helpers/handleCastErr";
import { handlerValidationErr } from "../helpers/handleValidationErr";
import AppError from "../helpers/appError";
import { handleZodErr } from "../helpers/handleZodErr";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = StatusCodes.BAD_REQUEST; // ✅ primitive number
  let message = "Something went wrong!";

  // Duplicate key error
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateErr(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // CastError (invalid ObjectId)
  else if (err.name === "CastError") {
    const simplifiedError = handleCastErr(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod validation error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodErr(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationErr(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Generic JS error
  else if (err instanceof Error) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: env.NODE_ENV === "development" ? err : undefined,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
