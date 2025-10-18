import { Query } from "mongoose";
import { excludeFields } from "../constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };
    for (const field of excludeFields) delete filter[field];
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchedText || this.query.searchTerm || "";
    if (searchTerm) {
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find(searchQuery);
    }
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const offset = Number(this.query.offset);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    if (!isNaN(offset)) {
      this.modelQuery = this.modelQuery.skip(offset).limit(limit);
    } else {
      const skip = (page - 1) * limit;
      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    }

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();

    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;
    const offset = Number(this.query.offset) || 0;

    const totalPage = Math.ceil(totalDocuments / limit);

    return {
      total: totalDocuments,
      limit,
      page: offset ? Math.floor(offset / limit) + 1 : page,
      totalPage,
    };
  }
}
