import { LatLng } from "leaflet";
import { SummaryI } from "./Route";

// User Interface extends Document so that its type has access to mongodb methods.

export interface LoginDataI {
    email: string;
    password: string;
}

export interface RegisterDataI extends LoginDataI {
    firstName: string;
    lastName: string;
    telephone?: string;
}
export interface UserI extends RegisterDataI{
    _id: string;
    messages?: unknown[];
    places?: LatLng[];
    contacts?: unknown[];
    tripHistory?: SummaryI[]
}



