import { Router } from "express";
import { notifyContacts } from "../controllers/notifyController";

const router = Router();

// Define the route and map to the controller
router.post("/", notifyContacts);

export default router;