import mongoose from "mongoose";
import { ShareI } from "../Types/share";

const shareSchema = new mongoose.Schema<ShareI>({
  owner: { type: String, required: true }, // TODO: Replace with reference to User schema when ready
  route: { type: String, required: true }, // TODO: Replace with reference to Route schema when ready
  password: { type: String, required: true }
})

const Share = mongoose.model<ShareI>("Share", shareSchema);

export default Share;