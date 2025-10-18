import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/signup", AuthController.signupController);
router.post("/login", AuthController.loginController);
router.post("/logout", AuthController.logoutController);

export const AuthRoutes = router;
