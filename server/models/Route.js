"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteSchema = exports.SummarySchema = exports.NavigationSchema = void 0;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema;
exports.NavigationSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    offset: {
        type: Number,
        required: true
    },
    direction: {
        type: String
    },
    severity: {
        type: String
    },
});
// Summary schema
exports.SummarySchema = new Schema({
    duration: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    baseDuration: {
        type: Number,
        required: false
    }
});
// Main schema for Route
exports.RouteSchema = new Schema({
    polyline: {
        type: Array,
        required: true
    },
    instructions: [exports.NavigationSchema],
    summary: exports.SummarySchema,
});
var RouteModel = mongoose_1.default.model('Route', exports.RouteSchema);
exports.default = RouteModel;
