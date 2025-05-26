import mongoose from "mongoose";
export interface SettingsI {
  notifyNearby: boolean,
  notifyAuthorities: boolean,
  allowNotifications: boolean,
  defaultSos: string,
  theme: string

}

export const settingsSchema = new mongoose.Schema<SettingsI>({
  notifyNearby: { type: Boolean, required: true, default: false },
  notifyAuthorities: { type: Boolean, required: true, default: false },
  allowNotifications: { type: Boolean, required: true, default: false },
  defaultSos: { type: String, required: true, default: "<Please enter a message and save it!>" },
  theme: {type: String, required: true, default: "dark"}

}, { timestamps: true });

const Settings = mongoose.model<SettingsI>("Settings", settingsSchema);

export default Settings;

