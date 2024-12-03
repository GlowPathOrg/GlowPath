"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var shareSchema = new mongoose_1.default.Schema({
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    route: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Route", required: true },
    password: { type: String, required: true }
}, { timestamps: true });
var Share = mongoose_1.default.model("Share", shareSchema);
exports.default = Share;
