import express from "express";
import { createShare, accessShare } from "../controllers/shareControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const shareRoutes = express.Router();

shareRoutes.post("/share", authMiddleware, createShare); // TODO: uncomment authMiddleware when ready
shareRoutes.post("/share/:id", accessShare);

export default shareRoutes;