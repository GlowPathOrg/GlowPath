"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authControllers_1 = require("../controllers/authControllers");
var authMiddleware_1 = require("../middleware/authMiddleware");
var authRoutes = express_1.default.Router();
authRoutes.post('/register', authControllers_1.registerController);
authRoutes.post('/login', authControllers_1.loginController);
authRoutes.post('/edit', authMiddleware_1.authMiddleware, authControllers_1.editController);
exports.default = authRoutes;
