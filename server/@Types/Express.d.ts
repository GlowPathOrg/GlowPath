import { UserI } from "./user";
import { ShareI } from "./Share";
import { RouteI } from "./Route";

declare global {
    namespace Express {
        interface Request {
            user?: UserI;
            share?: ShareI;
            route?: RouteI;
        }
    }
}