import mongoose, { Schema, model } from "mongoose";
import { IConversationMessage } from "../entities/ConversationMessage.js";

// SCHEMA
const ConversationMessageSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    content: {
        type: String,
        required: true
    },
    by: {
        type: String,
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
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
    }
});

export const ConversationMessageModel = model<IConversationMessage>("ConversationMessage", ConversationMessageSchema);