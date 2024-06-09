import { NextFunction, Request, Response } from "express";
import { Question, QuestionExceptAuthor } from "../types/question.type";

import questionService from "../services/question.service";

class QuestionController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;
      const { uid } = req.user;
      const newQuestion: QuestionExceptAuthor = {
        uid: uid,
        title: title,
        content: content,
      };
      questionService.create(newQuestion);
      res.status(201).json({ message: "Question created successfully." });
    } catch (error) {
      next(error);
    }
  }
  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNumber: number = Number(req.query.pageNumber) || 1;
      const pageSize: number = Number(req.query.pageSize) || 10;

      const questions = await questionService.read(pageNumber, pageSize);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  }
  async readOneByQid(req: Request, res: Response, next: NextFunction) {
    try {
      const qid: number = Number(req.params.qid);
      const question = await questionService.readOneByQidAndUpdateHit(
        qid,
        req.user.uid
      );
      res.json(question);
    } catch (err) {
      next(err);
    }
  }
  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.user;
      const qid = Number(req.params.qid);

      await questionService.likeWithQuestion(uid, qid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
  async unLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.user;
      const qid = Number(req.params.qid);

      await questionService.unLikeWithQuestion(uid, qid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const qid = Number(req.query.qid);
      const uid = await questionService.findAuthor(Number(qid));

      if (req.user.uid !== uid) throw new Error("not Matched User");
      const { title, content } = req.body;
      const updatedQuestion: QuestionExceptAuthor = {
        uid: uid,
        title: title,
        content: content,
      };

      questionService.update(qid, updatedQuestion);
      res.status(201).json({ message: "Question updated successfully." });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const qid = Number(req.query.qid);
      const uid = await questionService.findAuthor(Number(qid));
      if (req.user.uid !== uid) throw new Error("not Matched User");
      questionService.delete(qid);
      res.status(201).json({ message: "Question deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}

export default new QuestionController();
