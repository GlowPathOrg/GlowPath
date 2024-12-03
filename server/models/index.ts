import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const path: string = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/glowpath"

const DBConnect = async () => {
    try {
        await mongoose.connect(path);
        console.log('Connected to local database');
        return {
            statusCode: 200,
        };
    } catch (e) {
        console.log('Error connecting to local database: ', e)
        return {
            statusCode: 500,

        };
    }
}
export default DBConnect;