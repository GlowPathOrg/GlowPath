import express from "express";
import { routeController } from "../controllers/routeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const routingRoutes = express.Router();


routingRoutes.get('/fetch', routeController);




export default routingRoutes;