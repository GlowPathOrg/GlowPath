import { UserI } from "./user";

declare global {
    namespace Express {
        interface Request {
            user?: UserI;
        }
    }
}