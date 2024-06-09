import { Router } from "express";

import authController from "../../controllers/auth.controller";

const router = Router();
router.post("/login", authController.login);
router.post("/logout");
router.post("/refresh", authController.refresh);
export default router;
