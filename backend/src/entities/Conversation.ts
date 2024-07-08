"use strict";
import { Consumer, IConsumer } from "./Consumer.js";
import { IUser, User } from "./User.js";
import mongoose from "mongoose";

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  subject: string;
  consumer: mongoose.Types.ObjectId | IConsumer | Consumer;
  user?: mongoose.Types.ObjectId | IUser | User;
  createdAt: Date;
  deletedAt?: Date;
}

export class Conversation {
  _id: mongoose.Types.ObjectId;
  subject: string;
  consumer: mongoose.Types.ObjectId | IConsumer | Consumer;
  user?: mongoose.Types.ObjectId | IUser | User;
  createdAt: Date;
  deletedAt?: Date;
  
  constructor(conversation: IConversation) {
    this._id = conversation._id || new mongoose.Types.ObjectId();
    this.subject = conversation.subject;
    this.consumer = conversation.consumer;
    this.user = conversation.user;
    this.createdAt = conversation.createdAt || new Date();
    this.deletedAt = conversation.deletedAt;
  }
}