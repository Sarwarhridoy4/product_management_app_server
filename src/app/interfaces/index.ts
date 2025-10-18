import { Types } from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}
