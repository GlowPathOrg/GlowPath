import express from "express";
import { routeController } from "../controllers/routeController";
import { authMiddleware } from "../middleware/authMiddleware";


const routingRoute = express.Router();


export default routingRoute.post('/route', routeController);




