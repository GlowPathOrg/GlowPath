"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var User_1 = require("../models/User");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var JWT_SECRET = process.env.JWT_SECRET;
var authMiddleware = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeaders, token, decoded, id, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeaders = req.headers['authorization'];
                if (!(authHeaders && JWT_SECRET)) return [3 /*break*/, 4];
                token = authHeaders.split(' ')[1];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                id = decoded.id;
                return [4 /*yield*/, User_1.default.findOne({ _id: id })];
            case 2:
                user = _a.sent();
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    res.status(404).json({ message: "User not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                if (error_1 instanceof Error) {
                    if (error_1.name === "TokenExpiredError") {
                        res.status(401).json({ message: "Token has expired" });
                    }
                    else if (error_1.name === "JsonWebTokenError") {
                        res.status(401).json({ message: "Invalid token" });
                    }
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.authMiddleware = authMiddleware;
