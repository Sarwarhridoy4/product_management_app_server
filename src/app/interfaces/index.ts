import mongoose from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
