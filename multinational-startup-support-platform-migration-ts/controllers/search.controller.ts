import { NextFunction, Request, Response } from "express";
import searchService from "../services/search.service";

class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    const keyword: string | null = req.query.keyword?.toString() ?? null;
    const searchTarget: string | null = req.query.target?.toString() ?? null;
    const searchResult = await searchService.search(keyword, searchTarget);
    res.json(searchResult);
  }
}

export default new SearchController();
