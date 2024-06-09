import { NextFunction, Request, Response } from "express";

import articleService from "../services/article.service";

class ArticleController {
  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNumber = Number(req.query.pageNumber) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      const articles = await articleService.read(pageNumber, pageSize);
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async readOneByAid(req: Request, res: Response, next: NextFunction) {
    try {
      const aid = Number(req.params.aid);
      const uid = Number(req.user.uid);
      const article = await articleService.readOneByAid(aid, uid);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = Number(req.user.uid);
      const aid = Number(req.params.aid);
      await articleService.likeWithArticle(uid, aid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
  async unLike(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = Number(req.user.uid);
      const aid = Number(req.params.aid);
      await articleService.unLikeWithArticle(uid, aid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
}

export default new ArticleController();
