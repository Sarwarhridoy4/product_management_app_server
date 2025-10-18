import { Router } from "express";
import { CategoryController } from "./category.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.use(checkAuth());

router.get("/", CategoryController.listCategories);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;
