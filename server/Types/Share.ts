import { UserI } from "../../@Types/User";
import { RouteI } from "./Route";

export interface ShareI {
    _id?: string;
    owner: UserI;
    route: RouteI;
    password: string;
}