import { Router } from "express";
import guardMiddleware from "../../middlewares/guard.middleware";
import userController from "../../controllers/user.controller";
import PasswordEncoder from "../../helpers/password-encoder.helper";
import sponseBoardController from "../../controllers/sponse-board.controller";
const router: Router = Router();

/**
 * TODO: sponse-board
 */
router.get("/", sponseBoardController.readAll);

// /**
//  * TODO: sponse-board details
//  */
router.get("/:id", guardMiddleware, sponseBoardController.read);

router.post("/", guardMiddleware, sponseBoardController.create);
// router.put("/", sponseBoardController.update);
// router.delete("/", sponseBoardController.delete);

router.post("/:sid/recruit", guardMiddleware, sponseBoardController.apply);
router.post("/:sid/invest", guardMiddleware, sponseBoardController.invest);
// router.put(
//   "/recruit",
//   guardMiddleware,
//   sponseBoardController.approveWithRecruit
// );
router.put("/invest", sponseBoardController.approveWithInvest);
router.put("/recruit", sponseBoardController.approveWithRecruit);
/**
 * TODO: 유저가 join, funding하면 user details에서 목록 보여주기
 */
export default router;
