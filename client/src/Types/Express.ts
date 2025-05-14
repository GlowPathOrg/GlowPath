import { UserI } from "./User";

export interface AuthResponse {
  token?: string;
  message?: string;
  updated?: UserI;
  user?: UserI;
}
