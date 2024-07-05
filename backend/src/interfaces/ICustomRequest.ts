import { Consumer } from "../entities/Consumer.js";
import { User } from "../entities/User.js";
import { Request } from "express";

export interface CustomRequest extends Request {
    user?: User;
    consumer?: Consumer;
  }
  