import { NextFunction, Request, Response } from "express";

import cardNewsService from "../services/card-news.service";

class CardNewsController {
  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNumber = Number(req.query.pageNumber) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      const articles = await cardNewsService.read(pageNumber, pageSize);
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async readOneByCid(req: Request, res: Response, next: NextFunction) {
    try {
      const cid = Number(req.params.cid);
      const uid = Number(req.user.uid);
      const article = await cardNewsService.readOneByCid(cid, uid);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const cid = Number(req.params.cid);
      const uid = Number(req.user.uid);
      await cardNewsService.likeWithArticle(uid, cid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
  async unLike(req: Request, res: Response, next: NextFunction) {
    try {
      const cid = Number(req.params.cid);
      const uid = Number(req.user.uid);
      await cardNewsService.unLikeWithArticle(uid, cid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
}

export default new CardNewsController();
