import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME || "glowpath";

(async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
    console.log("Connected to database")
  } catch (error) {
    console.log(error);
  }
})();

export default mongoose;