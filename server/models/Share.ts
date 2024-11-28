import mongoose from "mongoose";
import { ShareI } from "../Types/share";

const shareSchema = new mongoose.Schema<ShareI>({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  route: { type: String, required: true }, // TODO: Replace with reference to Route schema when ready
  password: { type: String, required: true }
}, { timestamps: true });

const Share = mongoose.model<ShareI>("Share", shareSchema);

export default Share;