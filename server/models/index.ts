import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();


const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MongoDB URI is not defined in .env");
}

let client: MongoClient;

export const DBConnect = async () => {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            tls: true,  // Ensure SSL is enabled for MongoDB Atlas
        });

        try {
            await client.connect();
            console.log("Connected to MongoDB CLOUD!!");
        } catch (error) {
            console.error("Error connecting to MongoDB", error);
            throw error;
        }
    }
    return client;
};

// for collections
export const getCollection = (dbName: string, collectionName: string) => {
    if (!client) {
        throw new Error("MongoClient is not initialized. Call connectToDB first.");
    }
    return client.db('Glowpath').collection(collectionName);
};

// Connect to MongoDB using Mongoose
export const mongooseConnect = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: 'Glowpath',  // Specify the database name
        });
        console.log('Mongoose connected to MongoDB - Glowpath DB');
    } catch (error) {
        console.error('Mongoose connection error:', error);
        throw error;
    }
};






