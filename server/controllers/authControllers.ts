import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';
import crypto from 'crypto';
import { UserI } from '../Types/user';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')




export const registerController = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            throw new Error(`Email, password and role are all required`)
        }
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ error: 'Password does not meet strength requirements' });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
            ;
        };

        const user = new UserModel({ email, password, role });
        await user.save();
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: '48h' }
        );
        console.log('user successfully saved')
        return res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, email: user.email, role: user.role },
            token
        });

    }
    catch (error) {

        res.status(500).json({ error: `Server error in register controller: body is ${req.body}` + error })

    }
}

export const loginController = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        if (!process.env.JWT_SECRET) {
            console.log("No JWT Secret Found!");
            return res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
            ;
        }
        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
        return res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const profileController = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const thisUser: UserI | undefined = req.user;
        console.log('this user is ', req.user)
        if (thisUser) {
            return res.status(200).send(thisUser);
        } else {
            return res.status(404).send({ Error, message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal server error', error });
    }
};