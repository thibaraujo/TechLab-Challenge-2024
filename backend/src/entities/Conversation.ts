"use strict";
import { Consumer, IConsumer } from "./Consumer.js";
import { IUser, User } from "./User.js";
import mongoose from "mongoose";

export interface IConversation {
  id: mongoose.Types.ObjectId;
  subject: string;
  consumer: mongoose.Types.ObjectId | IConsumer | Consumer;
  user?: mongoose.Types.ObjectId | IUser | User;
  createdAt: Date;
  deletedAt?: Date;
}

export class Conversation {
  id: mongoose.Types.ObjectId;
  subject: string;
  consumer: mongoose.Types.ObjectId | IConsumer | Consumer;
  user?: mongoose.Types.ObjectId | IUser | User;
  createdAt: Date;
  deletedAt?: Date;
  // todo: ver se há necessidade de relação dupla com ConversationMessage, por hora, relação sempre será na entidade de menor cardinalidade

  constructor(conversation: IConversation) {
    this.id = conversation.id || new mongoose.Types.ObjectId();
    this.subject = conversation.subject;
    this.consumer = conversation.consumer;
    this.user = conversation.user;
    this.createdAt = conversation.createdAt || new Date();
    this.deletedAt = conversation.deletedAt;
  }
}