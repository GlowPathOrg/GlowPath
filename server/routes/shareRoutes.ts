import express from "express";
import { createShare, accessShare } from "../controllers/shareControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import { shareAuthMiddleware } from "../middleware/shareAuthMiddleware";

const shareRoutes = express.Router();

shareRoutes.post("/share", authMiddleware, createShare);
shareRoutes.post("/share/:id", shareAuthMiddleware, accessShare);

export default shareRoutes;