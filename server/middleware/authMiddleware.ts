import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user";
import dotenv from 'dotenv';
import { UserI } from "../Types/user";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'lalala this isnt secure';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // REMOVE-START
    // extract token from auth headers
    const authHeaders = req.headers['authorization'];
    if (!authHeaders) {
        res.sendStatus(403);
        return;
    }
    const token = authHeaders.split(' ')[1];

    try {
        // verify & decode token payload,
        const { id } = jwt.verify(token, SECRET_KEY) as UserI;
        // attempt to find user object and set to req
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            res.sendStatus(401);
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(401);
    }
    // REMOVE-END
};


