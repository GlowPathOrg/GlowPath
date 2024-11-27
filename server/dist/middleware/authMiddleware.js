"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Access denied, no token provided" });
        return;
    }
    try {
        // todo update this
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;