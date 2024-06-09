import { Router } from "express";
import cardNewsController from "../../controllers/card-news.controller";
import guardMiddleware from "../../middlewares/guard.middleware";

const router = Router();
router.get("/", cardNewsController.read);
router.get("/:cid", guardMiddleware, cardNewsController.readOneByCid);
router.post("/:cid/like", guardMiddleware, cardNewsController.like);
router.delete("/:cid/like", guardMiddleware, cardNewsController.unLike);

export default router;
