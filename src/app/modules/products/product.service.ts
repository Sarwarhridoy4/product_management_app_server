import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/appError";
import { QueryBuilder } from "../../utils/queryBuilders";
import { IProduct, ProductPayload, ProductQuery } from "../../interfaces";
import { Product } from "../../models/product.model";
import { Types } from "mongoose";

export const listProductsService = async (query: ProductQuery) => {
  const builder = new QueryBuilder<IProduct>(
    Product.find(),
    query as Record<string, string>
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  if (query.searchedText) builder.search(["name"]);

  if (query.categoryId)
    builder.modelQuery = builder.modelQuery.find({
      category: query.categoryId,
    });

  const products = await builder.build();
  const meta = await builder.getMeta();

  return { message: "Products retrieved successfully", data: products, meta };
};

export const getProductBySlugService = async (slug: string) => {
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

  return { message: "Product retrieved successfully", data: product };
};

export const createProductService = async (payload: ProductPayload) => {
  const slug = payload.name.toLowerCase().replace(/\s+/g, "-");
  const product = await Product.create({ ...payload, slug });
  return { message: "Product created successfully", data: product };
};

export const updateProductService = async (
  id: string,
  payload: Partial<ProductPayload>
) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

  if (payload.name) product.name = payload.name;
  if (payload.description) product.description = payload.description;
  if (payload.images) product.images = payload.images;
  if (payload.price) product.price = payload.price;
  if (payload.categoryId)
    product.category = new Types.ObjectId(payload.categoryId);
  if (payload.name)
    product.slug = payload.name.toLowerCase().replace(/\s+/g, "-");

  await product.save();
  return { message: "Product updated successfully", data: product };
};

export const deleteProductService = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

  await product.deleteOne();
  return { message: "Product deleted successfully", data: product };
};

export const ProductServices = {
  listProductsService,
  getProductBySlugService,
  createProductService,
  updateProductService,
  deleteProductService,
};
