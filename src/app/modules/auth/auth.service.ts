import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/appError";
import { User } from "../../models/user.model";
import { LoginPayload, SignupPayload } from "../../interfaces";
import { createUserTokens } from "../../utils/userToken";

export const signupService = async (payload: SignupPayload) => {
  const { name, email } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "Email already in use");
  }

  const user = await User.create({
    name,
    email,
  });

  return {
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginService = async (payload: LoginPayload) => {
  const { email } = payload;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const { accessToken, refreshToken } = createUserTokens({
    _id: user._id,
    role: user.role,
    email: user.email,
  });

  return {
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export const AuthServices = {
  signupService,
  loginService,
};
