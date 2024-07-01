"use strict";
import mongoose from "mongoose";

export interface IConsumer {
  id: mongoose.Types.ObjectId; // unique
  firstName?: string; 
  lastName?: string;
  document: string; // unique
  birthDate?: Date; 
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date; // soft delete -> default null
}

export class Consumer {
  id: mongoose.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  document: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(consumer: IConsumer) {
    this.id = consumer.id || new mongoose.Types.ObjectId();
    this.firstName = consumer.firstName;
    this.lastName = consumer.lastName;
    this.document = consumer.document;
    this.birthDate = consumer.birthDate;
    this.createdAt = consumer.createdAt || new Date();
    this.updatedAt = consumer.updatedAt;
    this.deletedAt = consumer.deletedAt;
  }
}