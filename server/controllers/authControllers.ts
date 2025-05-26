import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import crypto from 'crypto';

dotenv.config();
// automatic jwtSecretgenerator
const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

const generateToken = (user: any) => {
    return jwt.sign(
        { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, telephone: user.telephone },
        jwtSecret,
        { expiresIn: '1d' }
    );
};

export const registerController = async (req: Request, res: Response): Promise<void> => {
    console.log('in register controller, message received!')
    const { email, password, firstName, lastName, telephone } = req.body;

    if (!email || !password || !firstName || !lastName) {
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
        {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            telephone: user.telephone,
            password: '*****',
            places: [],
            tripHistory: [],
            settings: {},
        },
        jwtSecret,
        { expiresIn: '48h' }
    );
    console.log(`user ${user.firstName} ${user.lastName} registered`)
    res.status(201).json({
        message: `${user.email} was successfully registered`,
        token,
        user
    });

}

export const editController = async (req: Request, res: Response): Promise<void | void> => {
    try {
        const toEdit: { [x: string]: string; password: string; _id: string } = req.body;

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
        /*    console.log('after comparing passwords:', toEdit.password, potentialUser.password);

           const isMatch = await bcrypt.compare(toEdit.password, potentialUser.password);

           if (!isMatch) {

               res.status(401);
               throw new Error('passwords did not match. could not edit information')
           } */
        const update = { [fieldToUpdate]: toEdit[fieldToUpdate] };

        const updated = await UserModel.findOneAndUpdate(filter, update);

        if (updated) {
            const token = jwt.sign({ _id: updated._id, email: updated.email, firstName: updated.firstName, lastName: updated.lastName, telephone: updated.telephone, settings: updated.settings, tripHistory: updated.tripHistory, places: updated.places }, jwtSecret, { expiresIn: '1d' });
            res.status(200).json({
                token,
                user: {
                    _id: updated._id,
                    email: updated.email,
                    firstName: updated.firstName,
                    lastName: updated.lastName,
                    telephone: updated.telephone,
                    password: '*******',
                    places: updated.places,
                    tripHistory: updated.tripHistory,
                    settings: updated.settings
                }
            });



        }

        else {
            res.status(400);
            throw new Error('User info not found')
        }
    }
    catch (error) {

        res.status(500).json({ error: `Server error in edit controller:` + error })

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
            res.status(401).json({ error: "User not found" });
            return;


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
                return;
            }

            const token = jwt.sign({ _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, telephone: user.telephone }, jwtSecret, { expiresIn: '1d' });
            res.status(200).json({
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    telephone: user.telephone,
                    places: user.places,
                    settings: user.settings,
                    tripHistory: user.tripHistory
                }
            });
        }
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const fetchController = async (req: Request, res: Response): Promise<void | void> => {
    try {
        const { user } = req.body;
        if (!user) {
            res.status(400)
            throw new Error('[fetchController]: No user data sent')
        }
        const filter = { _id: user._id }
        const toReturn = await UserModel.findOne(filter)
        if (toReturn) {
            res.status(200).json(toReturn)
        }
    }

    catch {

    }
}