import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables.");
}

let client: MongoClient;

/**
 * Connect to MongoDB using MongoClient.
 * This is useful for low-level MongoDB operations.
 */
export const DBConnect = async () => {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            tls: true, // Enable secure connection
            connectTimeoutMS: 30000, // 30 seconds timeout for initial connection
        });

        try {
            await client.connect();
            console.log("Successfully connected to MongoDB via MongoClient.");
        } catch (error) {
            console.error("Error connecting to MongoDB via MongoClient:", error);
            throw error;
        }
    }
    return client;
};

/**
 * Retrieve a specific collection from the database.
 */
export const getCollection = (dbName: string, collectionName: string) => {
    if (!client) {
        throw new Error("MongoClient is not initialized. Call DBConnect first.");
    }
    return client.db(dbName).collection(collectionName);
};

/**
 * Connect to MongoDB using Mongoose.
 * This is useful for working with schemas and models.
 */
export const mongooseConnect = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: 'Glowpath',
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
        });
        console.log("Successfully connected to MongoDB via Mongoose.");
    } catch (error) {
        console.error("Error connecting to MongoDB via Mongoose:", error);
        throw error;
    }
};
