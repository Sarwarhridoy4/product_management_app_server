import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";

const signupController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.signupService(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User registered successfully",
      data: user,
    });
  }
);

const loginController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.loginService(req.body);

    setAuthCookie(res, loginInfo.tokens);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User login successful",
      data: loginInfo,
    });
  }
);

const logoutController = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Logged out successfully",
    data: null,
  });
});

export const AuthController = {
  signupController,
  loginController,
  logoutController,
};
