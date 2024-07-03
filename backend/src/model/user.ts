import e from "express";
import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../entities/User.js";

// SCHEMA
const UserSchema = new Schema({
    _id: {
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
        required: true,
        select: false
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

export const UserModel = model<IUser>("User", UserSchema);