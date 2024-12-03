import { Schema, model, Document } from "mongoose";

export interface ContactDocument extends Document {
    email?: string;
    telephone?: string;
    trusted: boolean;
    emergency: boolean;
    favorite: boolean;
}

const contactSchema = new Schema<ContactDocument>({
    email: { type: String },
    telephone: { type: String },
    trusted: { type: Boolean, required: true },
    emergency: { type: Boolean, required: true },
    favorite: { type: Boolean, required: true }
});

// required email for member or telephone for nonmember
contactSchema.pre("validate", function (next) {
    if (!this.email && !this.telephone) {
        next(new Error("Either email or telephone must be provided"));
    } else if (this.email && this.telephone) {
        next(new Error("Cannot provide both email and telephone"));
    } else {
        next();
    }
});

export const ContactModel = model<ContactDocument>("Contact", contactSchema);
