import { Router } from "express";

//import answerController from "../../controllers/answer.controller";
import questionController from "../../controllers/question.controller";
import guardMiddleware from "../../middlewares/guard.middleware";
import answerController from "../../controllers/answer.controller";

const router = Router();

/**TODO:consider pagination behavior */
/**TODO: 좋아요 순, 조회 순으로 */
router.post("/", guardMiddleware, questionController.create);
router.get("/", questionController.read);
router.get("/:qid", guardMiddleware, questionController.readOneByQid);
router.post("/:qid/like", guardMiddleware, questionController.like);
router.delete("/:qid/like", guardMiddleware, questionController.unLike);

router.put("/", guardMiddleware, questionController.update);
router.delete("/", guardMiddleware, questionController.delete);

// /**CRUD ANSWER */
router.post("/:qid/answer", guardMiddleware, answerController.create);
router.put("/:qid/answer", guardMiddleware, answerController.update);
router.delete("/:qid/answer", guardMiddleware, answerController.delete);
router.post("/:qid/answer/like", guardMiddleware, answerController.like);
router.delete("/:qid/answer/like", guardMiddleware, answerController.unLike);
export default router;
