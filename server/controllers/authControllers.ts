import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import crypto from 'crypto';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')


export const registerController = async (req: Request, res: Response): Promise<void | void > => {
    try {
        const { email, password, firstName, lastName, telephone } = req.body;

        if (!email || !password || !firstName || !lastName  ) {
            throw new Error(`Name, email, password are all required`)
        }
        if (password.length < 8 /* || !/[A-Z]/.test(password) || !/[0-9]/.test(password) */) {
            throw new Error(`Password doesn't meet strength requirements`)
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400)
            throw new Error('User already exists');
            ;
        };

        const user = new UserModel({ email, password, firstName, lastName, telephone });
        await user.save();
        const token = jwt.sign(
            { _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                telephone: user.telephone,
                password: '*****',
                messages: [],
                places: [],
                contacts: [],
                tripHistory: []
},
            jwtSecret,
            { expiresIn: '48h' }
        );
        console.log(`user ${user.firstName} ${user.lastName} registered`)
        res.status(201).json({
            message: `${user.email} was successfully registered`,
            token
        });

    }
    catch (error) {

        res.status(500).json({ error: `Server error in register controller:` + error })

    }
}

export const loginController = async (req: Request, res: Response): Promise<void | void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('Missing email or password')
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401);
            throw new Error('No user found');

        }
         if (!process.env.JWT_SECRET) {
                console.log("No JWT Secret Found!");
                res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
                ;
            }
        else {

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
        }

            const token = jwt.sign({ id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, telephone: user.telephone }, jwtSecret, { expiresIn: '1d' });
            res.status(200).json({
                token,
                user: {_id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                telephone: user.telephone,
                password: '*******',
                messages: [],
                places: [],
                contacts: [],
                tripHistory: []}
            });
    }
}
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
}