import { Document } from "mongoose";
import { SummaryI } from "./Route.js";
import { ShareI } from "./Share.js";

// User Interface extends Document so that its type has access to mongodb methods.
//changed
export interface UserI extends Document {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    telephone?: string;
    messages?: [];
    places?: [];
    contacts?: [];
    shareHistory?: ShareI[];
    settings: [];
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}