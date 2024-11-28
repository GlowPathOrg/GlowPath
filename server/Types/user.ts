import { Document } from "mongoose";

// User Interface extends Document so that its type has access to mongodb methods.
export interface UserI extends Document {
    _id: string;
    email: string;
    password: string;
    role: 'traveller' | 'observer';
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}