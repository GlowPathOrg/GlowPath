import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

import {  SummaryI, SummarySchema } from './Route.js';
import { SettingsI, settingsSchema } from './Settings.js';




// User Interface extends Document so that its type has access to mongodb methods.
//changed
export interface UserI {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    telephone?: string;
    places?: [][];
    tripHistory: SummaryI,
    settings: SettingsI[];
}

interface UserDocument extends UserI, Document {
    comparePassword (candidatePassword: string): Promise<boolean>;
}


const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
            validator: (email: string) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: "Invalid email format",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
    },
    telephone: {
        type: String,
        validate: {
            validator: (telephone: string) =>
                !telephone || /^[0-9\-\+]{9,15}$/.test(telephone),
            message: "Invalid telephone format",
        },
    },
    places: {
        type: [[]],
        required: false
    },
    tripHistory: {
        type: [SummarySchema],
        required: [true, "tripHistory is required"]
    },
    settings: {
        type: [settingsSchema],
        required: [true, "Settings is required"]
    }
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error("Error hashing password:", error);
        if (error instanceof Error) {
            next(error);
        }
    }
});



userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false; // Default to false on error
    }
};



const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
