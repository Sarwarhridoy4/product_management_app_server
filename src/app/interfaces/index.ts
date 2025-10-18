import { Document, Types } from "mongoose";

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

export interface ICategory extends Document {
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryQuery {
  [key: string]: string | undefined; // <-- allows dynamic string keys
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  searchedText?: string;
  offset?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
}

export interface IProduct {
  name: string;
  description?: string;
  images: string[];
  price: number;
  slug: string;
  category: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductQuery {
  page?: string;
  limit?: string;
  offset?: string;
  sort?: string;
  fields?: string;
  searchedText?: string;
  categoryId?: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  images?: string[];
  price: number;
  categoryId: string;
}
