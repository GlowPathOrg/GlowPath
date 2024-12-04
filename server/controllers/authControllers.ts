import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import crypto from 'crypto';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

const generateToken = (user: any) => {
    return jwt.sign(
        { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, telephone: user.telephone },
        jwtSecret,
        { expiresIn: '1d' }
    );
};

export const registerController = async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstName, lastName, telephone } = req.body;

    if (!email || !password || !firstName || !lastName) {
        throw new Error('Name, email, and password are required');
    }

    if (password.length < 8) {
        throw new Error("Password doesn't meet the minimum length requirement of 8 characters");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const newUser = new UserModel({ email, password, firstName, lastName, telephone });
    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
        message: `${newUser.email} was successfully registered`,
        token,
        user: {
            _id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            telephone: newUser.telephone,
        },
    });
};

export const editController = async (req: Request, res: Response): Promise<void> => {
    const { _id, password, ...updates } = req.body;

    if (!updates || !_id) {
        res.status(400).json({
            message: 'Invalid request, no updates or user ID provided',
        });
        throw new Error;
    }

    const user = await UserModel.findById(_id);
    if (!user) {
        res.status(400).json({
            message: 'User not found',
        });
        throw new Error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({
            message: 'Incorrect password',
        });
        throw new Error
    }

    Object.assign(user, updates);
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
        message: 'User information updated successfully',
        token,
        user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            telephone: user.telephone,
        },
    });
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Email and password are required',
        })
        throw new Error;

    }

    const user = await UserModel.findOne({ email });
    if (!user) {
        res.status(400).json({
            message: 'Invalid email or password',
        });
        throw new Error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({
            message: 'Login successful',
            });
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user);

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            telephone: user.telephone,
        },
    });
};
