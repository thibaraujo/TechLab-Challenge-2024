"use strict";
import mongoose from "mongoose";

export enum Profile {
  Sudo = "sudo",
  Standard = "standard",
}

export interface IUser {
  id: mongoose.Types.ObjectId; // unique
  username: string; // unique
  email: string; // unique
  password: string; // criptografar
  profile: Profile; 
  createdAt: Date; 
  updatedAt?: Date; // user update -> default null
  deletedAt?: Date; // user soft delete -> default null
}
export class User {
  id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profile: Profile;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(user: IUser) {
    this.id = user.id || new mongoose.Types.ObjectId();
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.profile = user.profile;
    this.createdAt = user.createdAt || new Date();
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}