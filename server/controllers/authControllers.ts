import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserI } from '../Types/user';

const jwtSecret = 'lsdkfjalsdkfj;a';
const users: UserI[] = [];

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {

        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            throw new Error(`Email, password and role are all required`)
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user: UserI = { email, password: hashedPassword, role };
        console.log(user)
        // todo add logic to save to model
        // await user.save();
        users.push(user);
        console.log('User array updated: ', user)
        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, email: user.email, role: user.role }
        });

    }
    catch (error) {

        res.status(500).json({ error: `Server error in register controller: body is ${req.body}` + error })

    }
}

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        // todo add model logic to controler
        // const user = await User.findOne({ email });
        const user = users.find((element)=> element.email === email)
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('JWT_SECRET in function:', process.env.JWT_SECRET);
        // Generate JWT token
        if (typeof process.env.JWT_SECRET === undefined) {
            console.log("No JWT Secret Found!");
            res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
            return;
        }
        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
