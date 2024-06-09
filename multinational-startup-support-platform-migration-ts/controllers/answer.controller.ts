import { NextFunction, Request, Response } from "express";
import { Answer, AnswerDefault } from "../types/answer.type";

import questionService from "../services/question.service";

class AnswerController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.user;
      const qid = Number(req.params.qid);
      const { content } = req.body;
      const newAnswer: AnswerDefault = { uid: uid, qid: qid, content: content };
      await questionService.createAnswer(newAnswer);
      res.status(201).json({ message: "Question created successfully." });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const aid = Number(req.query.aid);
      const qid = Number(req.params.qid);
      const uid = await questionService.findAnswerAuthor(qid, aid);
      const { content } = req.body;
      if (req.user.uid !== uid) throw new Error("not Matched User");

      const updatedAnswer: AnswerDefault = {
        uid: uid,
        qid: qid,
        content: content,
      };

      questionService.updateAnswer(aid, updatedAnswer);
      res.status(201).json({ message: "Question updated successfully." });
    } catch (error) {
      next(error);
    }
  }
  async like(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.user;
      const qid = Number(req.params.qid);
      const aid = Number(req.query.aid);

      await questionService.likeWithAnswer(uid, qid, aid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
  async unLike(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.user;
      const qid = Number(req.params.qid);
      const aid = Number(req.query.aid);

      await questionService.unLikeWithAnswer(uid, qid, aid);

      res.json({ state: "success" });
    } catch (err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const qid = Number(req.query.qid);
      const aid = Number(req.query.aid);
      const uid = await questionService.findAnswerAuthor(qid, aid);
      if (req.user.uid !== uid) throw new Error("not Matched User");
      questionService.deleteAnswer(Number(qid), Number(aid));
      res.status(201).json({ message: "Answer deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnswerController();
