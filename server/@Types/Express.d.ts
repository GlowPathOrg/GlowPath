import { UserI } from "./User";

declare global {
  namespace Express {
    interface Request {
      user?: UserI;
    }
  }
}