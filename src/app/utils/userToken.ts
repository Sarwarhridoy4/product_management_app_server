import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "./jwt";
import { env } from "../config/env";
import AppError from "../helpers/appError";
import { User } from "../models/user.model";
import { IUser } from "../interfaces";

// Generate access and refresh tokens
export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  // Use the unified env variables
  const accessToken = generateToken(
    jwtPayload,
    env.JWT_SECRET,
    env.JWT_EXPIRES_IN
  );

  const refreshToken = generateToken(
    jwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Refresh token logic: issue new access token
export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
): Promise<string> => {
  let verifiedRefreshToken: JwtPayload;

  try {
    verifiedRefreshToken = verifyToken(
      refreshToken,
      env.JWT_REFRESH_SECRET
    ) as JwtPayload;
  } catch (err) {
    console.error("❌ Invalid refresh token:", err);
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  // Ensure user exists
  const user = await User.findOne({ email: verifiedRefreshToken.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateToken(
    jwtPayload,
    env.JWT_SECRET,
    env.JWT_EXPIRES_IN
  );

  return newAccessToken;
};
