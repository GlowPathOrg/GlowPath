import express from "express";
import { editController, fetchController, loginController, registerController } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const authRoutes = express.Router();


authRoutes.post('/register', registerController);
authRoutes.post('/login',  loginController);
authRoutes.post('/edit', authMiddleware, editController);
authRoutes.get('/profile', authMiddleware, fetchController);



export default authRoutes;