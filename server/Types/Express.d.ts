import { UserI } from "./user.js";
import { ShareI } from "./Share.js";
import { RouteI } from "./Route.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserI;
            share?: ShareI;
            route?: RouteI;
        }
    }
}