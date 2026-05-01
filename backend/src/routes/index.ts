import { Router } from "express";
import { healthController } from "../controllers/healthController";
import {
  loginController,
  signUpController,
} from "../controllers/authController";

export const router = Router();

router.get("/health", healthController);
router.post("/auth/sign-up", signUpController);
router.post("/auth/login", loginController);
