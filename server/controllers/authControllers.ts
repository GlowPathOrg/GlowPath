import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import crypto from 'crypto';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')


export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, telephone } = req.body;

        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ error: "Name, email, password are all required" });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ error: "Password doesn't meet strength requirements" });
            return;
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        const newUser = new UserModel({ email, password, firstName, lastName, telephone });
        await newUser.save();

        const token = jwt.sign(
            {
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
            },
            jwtSecret,
            { expiresIn: '48h' }
        );

        res.status(201).json({
            message: `${newUser.email} was successfully registered`,
            token,
        });

    } catch (error) {
        res.status(500).json({ error: `Server error in register controller: ${error}` });
    }
};
export const editController = async (req: Request, res: Response): Promise<void | void> => {
    try {
        const toEdit: { [x: string]: string; password: string; _id: string } = req.body;
        console.log('to edit: ', toEdit)
        const fieldToUpdate = Object.keys(toEdit).find(key => key !== 'password' && key !== '_id');
        if (!fieldToUpdate) {
            res.status(400);
            throw new Error('could not read field to update')
        }
        const filter = { _id: toEdit._id };
        const potentialUser = await UserModel.findOne(filter);
        if (!potentialUser) {
            res.status(400);
            throw new Error('no user found')
        }

        const isMatch = await bcrypt.compare(toEdit.password, potentialUser.password);
        if (!isMatch) {
            res.status(401);
            throw new Error('passwords did not match. could not edit information')
        }

        const update = { [fieldToUpdate]: toEdit[fieldToUpdate] };
        const updated = await UserModel.findOneAndUpdate(filter, update);
        if (updated) {

            const token = jwt.sign({ id: updated._id, email: updated.email, firstName: updated.firstName, lastName: updated.lastName, telephone: updated.telephone }, jwtSecret, { expiresIn: '1d' });
            res.status(200).json({
                token,
                updated: {
                    _id: updated._id,
                    email: updated.email,
                    firstName: updated.firstName,
                    lastName: updated.lastName,
                    telephone: updated.telephone,
                    password: '*******',
                    messages: [],
                    places: [],
                    contacts: [],
                    tripHistory: []
                }
            });



        }

        else {
            res.status(400);
            throw new Error('User info not found')
        }
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
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    telephone: user.telephone,
                    password: '*******',
                    messages: [],
                    places: [],
                    contacts: [],
                    tripHistory: []
                }
            });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
}