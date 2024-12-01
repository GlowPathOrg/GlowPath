import express from "express";
import { loginController, registerController } from "../controllers/authControllers";
import { authMiddleware } from "../middleware/authMiddleware";


const authRoutes = express.Router();


authRoutes.post('/register', registerController);
authRoutes.post('/login',  loginController);
// authRoutes.get('/me', authMiddleware);



export default authRoutes;