import { Router } from "express";
import { healthController } from "../controllers/healthController";

export const router = Router();

router.get("/health", healthController);
