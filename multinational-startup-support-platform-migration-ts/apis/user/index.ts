import { Router } from "express";
import guardMiddleware from "../../middlewares/guard.middleware";
import userController from "../../controllers/user.controller";
const router: Router = Router();

router.post("/", userController.create);
router.get("/", guardMiddleware, userController.read);
// router.put("/", guardMiddleware, userController.update);
// router.delete("/", guardMiddleware, userController.delete);

export default router;
