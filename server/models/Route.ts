import mongoose from "mongoose";
const Schema = mongoose.Schema;


export interface InstructionsI {
    _id: string;
    actions: string[];
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
}


export interface SummaryI {
    _id?: string;
    duration?: number;
    length?: number;
    baseDuration?: number;
    date: string;
    destination: string;
}


export interface RouteI {
    _id?: string;
    polyline: [[]];
    instructions: InstructionsI[];
    summary: SummaryI;
}


export interface RouteRequestI {
    origin: string | number[]
    destination: string | number[] | null, // Destination coordinates as [latitude, longitude]
    transportMode?: 'pedestrian' | 'publicTransport' | 'bicycle' | 'car' | null,
    return?: 'polyline,summary,instructions,actions',
}
export const NavigationSchema = new Schema({
    action: {
        type: String,
        required: true },
    duration: {
        type: Number,
        required: true },
    length: {
        type: Number,
        required: true },
    instruction: {
        type: String,
        required: true },
    offset: {
        type: Number,
        required: true },
    direction: {
        type: String },
    severity: {
        type: String },
});

// Summary schema
export const SummarySchema = new Schema({
    duration: {
        type: Number,
        required: true },
    length: {
        type: Number,
        required: true },
    baseDuration: {
        type: Number,
        required: false }
});

// Main schema for Route
export const RouteSchema = new Schema({
    polyline: {
        type: Array,
        required: true },
    instructions: [NavigationSchema],
    summary: [SummarySchema],

});

const RouteModel = mongoose.model<RouteI>('Route', RouteSchema);
export default RouteModel;