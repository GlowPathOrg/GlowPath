
import { SummaryI } from "./Route";

// User Interface extends Document so that its type has access to mongodb methods.
export interface SettingsI {
    notifyNearby: boolean,
    notifyAuthorities: boolean,
    allowNotifications: boolean,
    defaultSos: string,
    theme: string,

}

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
    places?: string[];
    tripHistory: SummaryI[],
    settings: SettingsI;
}




