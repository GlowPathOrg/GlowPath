import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserI } from '../@Types/User';

export const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        telephone: {
            type: String,
            required: false,
        },
        messages: {
            type: Array,
            required: false,
        },
        places: {
            type: Array,
            required: false,
        },
        contacts: {
            type: Array,
            required: false,
        },
        tripHistory: {
            type: Array,
            required: false,
        },




    },
    {
        timestamps: true,
    }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password for login
userSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<UserI>('User', userSchema);

export default UserModel;
