"use strict";
import { Conversation, IConversation } from "./Conversation.js";
import { IUser, User } from "./User.js";
import mongoose from "mongoose";

export enum ConversationMessageBy {
  Consumer = 'consumer',
  User = 'user',
  System = 'system',
}

export interface IConversationMessage {
  id: mongoose.Types.ObjectId;
  content: string;
  by: ConversationMessageBy;
  conversation: mongoose.Types.ObjectId | IConversation | Conversation;
  user?: mongoose.Types.ObjectId | IUser | User;
  createdAt: Date;
}

export class ConversationMessage {
  id: mongoose.Types.ObjectId;
  content: string;
  by: ConversationMessageBy;
  conversation: mongoose.Types.ObjectId | IConversation | Conversation;
  user?: mongoose.Types.ObjectId | IUser | User;
  createdAt: Date;
  
  constructor(conversationMessage: IConversationMessage) {
    this.id = conversationMessage.id || new mongoose.Types.ObjectId();
    this.content = conversationMessage.content;
    this.by = conversationMessage.by;
    this.conversation = conversationMessage.conversation;
    this.user = conversationMessage.user;
    this.createdAt = conversationMessage.createdAt || new Date();
  }
}
