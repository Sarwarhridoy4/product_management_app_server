import { Router } from "express";
import { ProductController } from "./product.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

// All routes protected
router.use(checkAuth());

router.get("/", ProductController.listProducts); // GET /products?searchedText=&categoryId=&page=&limit=&offset=
router.get("/:slug", ProductController.getProductBySlug);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoutes = router;
