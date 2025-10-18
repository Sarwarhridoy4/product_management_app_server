import { StatusCodes } from "http-status-codes";
import AppError from "../../helpers/appError";
import { QueryBuilder } from "../../utils/queryBuilders";
import { ICategory } from "../../interfaces";
import { Category } from "../../models/category.model";

interface CategoryQuery {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  searchedText?: string;
  offset?: string;
}

interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
}

export const listCategoriesService = async (query: CategoryQuery) => {
  const builder = new QueryBuilder<ICategory>(
    Category.find(),
    query as Record<string, string>
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  // Apply search if searchedText exists
  if (query.searchedText) {
    builder.search(["name"]);
  }

  const categories = await builder.build();
  const meta = await builder.getMeta();

  return {
    message: "Categories retrieved successfully",
    data: categories,
    meta,
  };
};

export const createCategoryService = async (payload: CategoryPayload) => {
  const { name, description, image } = payload;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory)
    throw new AppError(StatusCodes.CONFLICT, "Category already exists");

  const category = await Category.create({
    name,
    description: description || null,
    image: image || null,
  });

  return { message: "Category created successfully", data: category };
};

export const updateCategoryService = async (
  id: string,
  payload: CategoryPayload
) => {
  const category = await Category.findById(id);
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");

  category.name = payload.name || category.name;
  category.description = payload.description ?? category.description;
  category.image = payload.image ?? category.image;

  await category.save();

  return { message: "Category updated successfully", data: category };
};

export const deleteCategoryService = async (id: string) => {
  const category = await Category.findById(id);
  if (!category)
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");

  await category.deleteOne();

  return { message: "Category deleted successfully" };
};

export const CategoryServices = {
  listCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
