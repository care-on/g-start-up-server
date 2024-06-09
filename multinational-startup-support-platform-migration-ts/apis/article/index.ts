import { Router } from "express";

import articleController from "../../controllers/article.controller";
import guardMiddleware from "../../middlewares/guard.middleware";

const router = Router();

router.get("/", articleController.read);
router.get("/:aid", guardMiddleware, articleController.readOneByAid);
router.post("/:aid/like", guardMiddleware, articleController.like);
router.delete("/:aid/like", guardMiddleware, articleController.unLike);

export default router;
