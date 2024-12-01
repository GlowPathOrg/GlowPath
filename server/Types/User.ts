import { Document } from "mongoose";
import { SummaryI } from "./Route";

// User Interface extends Document so that its type has access to mongodb methods.
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
    tripHistory?: []
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}