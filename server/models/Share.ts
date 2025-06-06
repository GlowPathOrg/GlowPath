import mongoose from "mongoose";
import { RouteI } from "./Route";
import { UserI } from "./UserModel";

export interface ShareI {
  _id?: string;
  owner: UserI;
  route: RouteI;
  password: string;
  date: string;
}

export const shareSchema = new mongoose.Schema<ShareI>({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  password: { type: String, required: true },
  date: {type: String, required: true}
}, { timestamps: true });

const Share = mongoose.model<ShareI>("Share", shareSchema);

export default Share;