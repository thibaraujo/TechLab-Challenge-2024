import mongoose, { Schema, model } from "mongoose";
import { IConsumer } from "../entities/Consumer.js";

// SCHEMA
const ConsumerSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    document: {
        type: String,
        unique: true,
        required: true
    },
    birthDate: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

export const ConsumerModel = model<IConsumer>("Consumer", ConsumerSchema);