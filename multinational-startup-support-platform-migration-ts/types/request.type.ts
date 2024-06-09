import { Request } from "express";
import { UserPayload } from "./user.type.";
export interface CustomRequest extends Request {
  user: UserPayload; // or any other type
}
