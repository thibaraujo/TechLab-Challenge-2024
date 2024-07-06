"use strict";

import { celebrate, Segments, Joi } from "celebrate";
import { customMessages } from "../services/errorHandler.js";

export default {
    get() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
                consumer: Joi.string().length(24).hex(),
                user: Joi.string().length(24).hex(),
                distributed: Joi.string(),
                deleted: Joi.string().valid("true", "false"),
            },
        }, { messages: customMessages });
    },

    post() {
        return celebrate({
            [Segments.BODY]: {
                subject: Joi.string().required(),
                consumer: Joi.string().length(24).hex().required(),
                user: Joi.string().length(24).hex(),
            },
        }, { messages: customMessages });
    },

    put() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
            },
            [Segments.BODY]: {
                subject: Joi.string(),
                consumer: Joi.string().length(24).hex(),
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