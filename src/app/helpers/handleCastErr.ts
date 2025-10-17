/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.types";
import { StatusCodes } from "http-status-codes";

export const handleCastErr = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Invalid MongoDB ObjectID. Please provide a valid id",
  };
};
