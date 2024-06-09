import { NextFunction, Request, Response } from "express";
import { accessToken } from "../configs/token.config";
import { UserPayload } from "../types/user.type.";
import logger from "../configs/logger.config";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"]
      ? req.headers["authorization"].split(" ")
      : null;
    if (!token) throw new Error("token isn't exist");
    if (token[0] != "Bearer") throw new Error("invalid Token");
    await accessToken.verifyToken(token[1]);
    const payload: UserPayload = await accessToken.decodeToken(token[1]);
    req.user = payload;
    next();
  } catch (e) {
    next(e);
  }
};
