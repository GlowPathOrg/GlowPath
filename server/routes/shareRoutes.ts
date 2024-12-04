import express from "express";
import { createShare, accessShare } from "../controllers/shareControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { shareAuthMiddleware } from "../middleware/shareAuthMiddleware.js";

const shareRoutes = express.Router();

shareRoutes.post("/share", authMiddleware, createShare);
shareRoutes.post("/share/:id", shareAuthMiddleware, accessShare);

export default shareRoutes;