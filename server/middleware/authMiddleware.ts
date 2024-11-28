import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, } from "express";
import { UserI } from "../Types/user";


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access denied, no token provided" });
        return;
    }

    try {
        // todo update this
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserI;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

