import { ShareI } from "./share";
import { UserI } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: UserI;
      share?: ShareI;
    }
  }
}