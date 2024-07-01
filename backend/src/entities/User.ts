"use strict";
import mongoose from "mongoose";

export enum Profile {
  SUDO = "sudo",
  STANDARD = "standard",
}

export interface IUser {
  id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profile: Profile;
  createdAt: Date;
  deletedAt: Date;
}
export class User {
  id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profile: Profile;
  createdAt: Date;
  deletedAt: Date;

  constructor(user: IUser) {
    this.id = user.id || new mongoose.Types.ObjectId();
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.profile = user.profile;
    this.createdAt = user.createdAt || new Date();
    this.deletedAt = user.deletedAt || null;
  }
}