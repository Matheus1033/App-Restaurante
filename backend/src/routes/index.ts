import { Router } from "express";
import { healthController } from "../controllers/healthController";
import {
  loginController,
  signUpController,
} from "../controllers/authController";

import {
  createMenuItemController,
  deleteMenuItemController,
  getMenuItemByIdController,
  listMenuItemsController,
  updateMenuItemController,
} from "../controllers/menuController";

export const router = Router();

router.get("/health", healthController);
router.post("/auth/sign-up", signUpController);
router.post("/auth/login", loginController);

router.get("/menu", listMenuItemsController);
router.get("/menu/:id", getMenuItemByIdController);
router.post("/menu", createMenuItemController);
router.put("/menu/:id", updateMenuItemController);
router.delete("/menu/:id", deleteMenuItemController);
