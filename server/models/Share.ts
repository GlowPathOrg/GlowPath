import { Schema } from "mongoose";
import mongoose from "./index"
import { ShareI } from "../Types/share";

const shareSchema = new Schema<ShareI>({
  owner: { type: String, required: true }, // TODO: Replace with reference to User schema when ready
  route: { type: String, required: true }, // TODO: Replace with reference to Route schema when ready
  password: { type: String, required: true }
})

const Share = mongoose.model<ShareI>("Share", shareSchema);

export default Share;