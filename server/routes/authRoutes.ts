import express from "express";
import { editController, loginController, registerController } from "../controllers/authControllers";
import { authMiddleware } from "../middleware/authMiddleware";


const authRoutes = express.Router();


authRoutes.post('/register', registerController);
authRoutes.post('/login',  loginController);
authRoutes.post('/edit', authMiddleware, editController);



export default authRoutes;