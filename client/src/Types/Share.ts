import { UserI } from "./User";
import { RouteI } from "./Route";

export interface ShareI {
    _id?: string;
    owner: UserI;
    route: RouteI;
    password: string;
    date: string;
}