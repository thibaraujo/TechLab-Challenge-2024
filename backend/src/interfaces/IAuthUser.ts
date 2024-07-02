import { User } from "../entities/User.js";

export interface AuthUser extends User {
    token?: string;
}