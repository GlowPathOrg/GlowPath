import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt";
import Share from "../models/Share.js";


export const shareAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!id || !password) {
      res.status(400).json({error: "Please provide both id and password"});
      return;
    }
    if (typeof id !== "string" || typeof password !== "string") {
      res.status(400).json({error: "All values must be valid strings"});
      return;
    }
    const sanitizedId = id.replace(/[$/(){}]/g, "");
    const share = await Share.findOne({_id: sanitizedId});
    if (!share) {
      res.status(401).json({error: "Unauthorized"});
      return;
    }
    const matchingPasswords = await bcrypt.compare(password, share.password);
    if (!matchingPasswords) {
      res.status(401).json({error: "Unauthorized"});
      return;
    }
    req.share = share;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}