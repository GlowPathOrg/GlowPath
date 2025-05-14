import { LatLng } from "leaflet";
import { SummaryI } from "./Route";
import { ShareI } from "./Share";

// User Interface extends Document so that its type has access to mongodb methods.
export interface SettingsI {
    notifyNearby: boolean,
    notifyAuthorities: boolean,
    allowNotifications: boolean,
    defaultSos: string,

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
    places?: LatLng[];
    tripHistory: SummaryI,
    shareHistory: ShareI[];
    settings: SettingsI[];
}




