import { Document } from "mongoose";
export interface NavigationI {
    _id: string;
    action: string;
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
}


export interface SummaryI {
    _id: string;
    duration: number;
    length: number;
    baseDuration: number;
}


export interface RouteI extends Document {
    _id: string;
    polyline: string;
    instructions: NavigationI[];
    summary: SummaryI;
}
