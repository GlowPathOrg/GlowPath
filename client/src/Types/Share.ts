
import { RouteI } from "./Route";
import { UserI } from "./User";

export interface ShareI {
    _id?: string;
    owner: UserI;
    route: RouteI;
    password: string;
    date: string;
}