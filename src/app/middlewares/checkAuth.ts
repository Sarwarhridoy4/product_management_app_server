import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/appError";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import { env } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      //  Access token comes from Authorization header (Bearer token)
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!accessToken) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "No access token provided"
        );
      }

      const verifiedToken = verifyToken(
        accessToken,
        env.JWT_SECRET
      ) as JwtPayload;

      const user = await User.findOne({ email: verifiedToken.email });

      if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User no longer exists");
      }

      // ✅ Role-based access (only if roles were provided in route)
      if (authRoles.length > 0 && !authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "You do not have permission for this route"
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("JWT error", error);
      next(error);
    }
  };
