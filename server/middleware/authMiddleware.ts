import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, } from "express";
import { UserI } from "../Types/user";


export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response<UserI> | void => {
    const authHeaders = req.headers['authorization'];
    if (!authHeaders) return res.sendStatus(403);
    const token = authHeaders.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Access denied, no token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserI;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

