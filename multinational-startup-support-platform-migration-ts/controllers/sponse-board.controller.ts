import { NextFunction, Request, Response } from "express";
import sponseBoardService from "../services/sponse-board.service";

class SponseBoardController {
  async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNumber = Number(req.query.pageNumber) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      const result = await sponseBoardService.readAll(pageNumber, pageSize);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id) || 1;
      const result = await sponseBoardService.read(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const title = req.body.title;
      const content = req.body.content;

      const { uid } = req.user;
      const numberOfRecruits: number = Number(req.body.numberOfRecruits) || 1;

      await sponseBoardService.create(title, content, uid, numberOfRecruits);
      res.json({ msg: "successfully created" });
    } catch (err) {
      next(err);
    }
  }
  async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.sid);

      const { uid } = req.user;
      await sponseBoardService.apply(id, uid);
      res.json({ msg: "successfully applied" });
    } catch (err) {
      next(err);
    }
  }
  async invest(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = Number(req.params.sid);

      const { uid } = req.user;
      await sponseBoardService.invest(id, uid);
      res.json({ msg: "successfully invest" });
    } catch (err) {
      next(err);
    }
  }
  async approveWithInvest(req: Request, res: Response, next: NextFunction) {
    try {
      const investId = Number(req.query.id);
      const status = req.query.status?.toString();
      const uid = 2;
      if (!status) throw new Error("status is required");
      await sponseBoardService.approveWithInvest(investId, uid, status);
      res.json({ msg: "successfully invest approve" });
    } catch (err) {
      next(err);
    }
  }
  async approveWithRecruit(req: Request, res: Response, next: NextFunction) {
    try {
      const recruitId = Number(req.query.id);
      const status = req.query.status?.toString();
      //   const { uid } = req.user;
      const uid = 1;
      if (!status) throw new Error("status is required");
      await sponseBoardService.approveWithRecruit(recruitId, uid, status);
      res.json({ msg: "successfully recruit" });
    } catch (err) {
      next(err);
    }
  }
}

export default new SponseBoardController();
