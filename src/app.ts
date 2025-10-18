import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status-codes";
import { env } from "./app/config/env";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app: Application = express();

const allowedOrigins = [env.FRONTEND_URL, "http://localhost:3000"];

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  })
);

// Entry point for routes
app.use("/", router);

// Application Entry Point
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Product Management API",
    status: httpStatus.OK,
    data: {
      version: "1.0.0",
      description: "API for managing products",
    },
  });
});

// Global Error Handler
app.use(globalErrorHandler);
// Not Found Handler
app.use(notFound);

export default app;
