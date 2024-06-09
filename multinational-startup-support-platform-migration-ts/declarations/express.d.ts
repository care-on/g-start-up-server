import { Request } from "express";

/**@PARAM save with user */
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
