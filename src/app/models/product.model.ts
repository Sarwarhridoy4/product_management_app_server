import { Schema, model } from "mongoose";
import { IProduct } from "../interfaces";



const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
