import { NextFunction, Request, Response } from "express";
import logger from "../configs/logger.config";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);
  res.send({ msg: err.message });
};
