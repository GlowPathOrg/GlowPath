import express from "express";
import { editController, loginController, registerController } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const authRoutes = express.Router();


authRoutes.post('/register', registerController);
authRoutes.post('/login',  loginController);
authRoutes.post('/edit', authMiddleware, editController);



export default authRoutes;