import { UserI } from "./user";

export interface ShareI {
  _id?: string;
  owner: UserI;
  route: string; // TODO: This should eventually correspond to the route type
  password: string;
}