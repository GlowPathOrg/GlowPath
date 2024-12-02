import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, } from "express";
import UserModel from "../models/User";
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const authHeaders = req.headers['authorization'];
    if (authHeaders && JWT_SECRET) {
        const token = authHeaders.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            const { id } = decoded;
            const user = await UserModel.findOne({ _id: id });
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {

            if (error instanceof Error) {
                if (error.name === "TokenExpiredError") {
                    res.status(401).json({ message: "Token has expired" });
                } else if (error.name === "JsonWebTokenError") {
                    res.status(401).json({ message: "Invalid token" });
                }
            }

            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }

    }


};