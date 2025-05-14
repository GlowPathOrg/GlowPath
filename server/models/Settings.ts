import mongoose from "mongoose";
export interface SettingsI {
  notifyNearby: boolean,
  notifyAuthorities: boolean,
  allowNotifications: boolean,
  defaultSos: string,

}

export const settingsSchema = new mongoose.Schema<SettingsI>({
  notifyNearby: { type: Boolean, required: true, default: false },
  notifyAuthorities: { type: Boolean, required: true, default: false },
  allowNotifications: { type: Boolean, required: true, default: false },
  defaultSos: { type: String, required: true, default: "Help! I am in danger." },

}, { timestamps: true });

const Settings = mongoose.model<SettingsI>("Settings", settingsSchema);

export default Settings;

/* export interface SettingsI {
  notifyNearby: boolean,
  notifyAuthorities: boolean,
  allowNotifications: boolean,
  defaultSos: string,

} */