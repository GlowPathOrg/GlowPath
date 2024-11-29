import mongoose from "mongoose";
const Schema = mongoose.Schema;


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
        required: true }
});

// Main schema for Route
export const RouteSchema = new Schema({
    polyline: {
        type: String,
        required: true },
    instructions: [NavigationSchema],
    summary: SummarySchema,
    password: String,
});

module.exports = mongoose.model('Directions', RouteSchema);