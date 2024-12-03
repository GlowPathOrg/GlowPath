import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface
export interface UserI extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    telephone?: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Schema definition
const userSchema = new Schema<UserI>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    telephone: { type: String },
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next();
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<UserI>('User', userSchema);
export default UserModel;
