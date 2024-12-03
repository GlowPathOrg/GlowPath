"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var routeController_1 = require("../controllers/routeController");
var routingRoutes = express_1.default.Router();
routingRoutes.get('/fetch', routeController_1.routeController);
exports.default = routingRoutes;
