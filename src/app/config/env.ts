import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/zod-express-db",
  FRONTEND_URL: process.env.FRONTEND_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
};
