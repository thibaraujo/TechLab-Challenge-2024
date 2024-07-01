import mongoose, { Schema, model } from "mongoose";
// INTERFACE
// SCHEMA
const UserSchema = new Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        enum: ["sudo", "standard"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
});
export const UserModel = model("User", UserSchema);
