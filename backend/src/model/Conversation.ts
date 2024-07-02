import mongoose, { Schema, model } from "mongoose";
import { IConversation } from "../entities/Conversation.js";

// SCHEMA
const ConversationSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    subject: {
        type: String,
        required: true
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consumer",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    createdAt: {
        type: Date,
        default: new Date(),
        immutable: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

export const ConversationModel = model<IConversation>("Conversation", ConversationSchema);