"use strict";

import { celebrate, Segments, Joi } from "celebrate";
import { ConversationMessageBy, ConversationMessageType } from "../entities/ConversationMessage.js";
import { customMessages } from "../services/errorHandler.js";

export default {
    get() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
            },
        }, { messages: customMessages });
    },

    post() {
        return celebrate({
            [Segments.BODY]: {
                content: Joi.string().required(),
                by: Joi.string().valid(...Object.values(ConversationMessageBy)).required(),
                conversation: Joi.string().length(24).hex().required(),
                user: Joi.string().length(24).hex(),
                type: Joi.string().valid(...Object.values(ConversationMessageType)).required(),
                fileId: Joi.string().length(24).hex(),
            },
        }, { messages: customMessages });
    },

    put() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
            },
            [Segments.BODY]: {
                content: Joi.string(),
                by: Joi.string().valid(...Object.values(ConversationMessageType)),
                conversation: Joi.string().length(24).hex(),
                user: Joi.string().length(24).hex(),
            },
        }, { messages: customMessages });
    },

    delete() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
            },
        }, { messages: customMessages });
    },
}