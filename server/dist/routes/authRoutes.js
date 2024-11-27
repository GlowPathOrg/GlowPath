"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authRoutes = express_1.default.Router();
// todo add controller functions
// register controller
// todo move interface into types file
//
authRoutes.post('/register', authControllers_1.registerController);
authRoutes.post('/login', authControllers_1.loginController);
exports.default = authRoutes;
