import express from "express";
import { loginController, registerController } from "../controllers/authControllers";


const authRoutes = express.Router();
// todo add controller functions
// register controller


// todo move interface into types file

//


authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);



export default authRoutes;