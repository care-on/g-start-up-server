import { Router } from "express";
import searchController from "../../controllers/search.controller";
const router: Router = Router();

router.get("/", searchController.search);

export default router;
