import { UserI } from "./User.js";
import { RouteI } from "./Route.js";

export interface ShareI {
    _id?: string;
    owner: UserI;
    route: RouteI;
    password: string;
}