import express from "express";
import { routeController } from "../controllers/routeController";
import { authMiddleware } from "../middleware/authMiddleware";


const routingRoutes = express.Router();


routingRoutes.get('/fetch', routeController);




export default routingRoutes;