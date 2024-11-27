import express from "express";
import { createShare, accessShare } from "../controllers/shareControllers";

const shareRoutes = express.Router();

shareRoutes.post("/share", /* authMiddleware */ createShare); // TODO: uncomment authMiddleware when ready
shareRoutes.get("/share/:id", accessShare);

export default shareRoutes;