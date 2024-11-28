import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, } from "express";
import UserModel from "../models/user";
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET= process.env.JWT_SECRET;


export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {

    const authHeaders = req.headers['authorization'];
    console.log('here is the secret key: ', JWT_SECRET)
    if (authHeaders && JWT_SECRET)  {
        const token = authHeaders.split(' ')[1];


        try {
            // verify & decode token payload,
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            const { id } = decoded;
            // attempt to find user object and set to req
            const user = await UserModel.findOne({ _id: id });
            if (user) req.user = user;
            next();
        } catch (error) {
            console.log('error in middleware', error)
            res.sendStatus(401);
        }
    }
    else res.sendStatus(403).json({message: 'Headers arent there!'})

};

//
