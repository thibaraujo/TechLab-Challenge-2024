import { Consumer } from "../entities/Consumer.js";

export interface AuthConsumer extends Consumer {
    token?: string;
}