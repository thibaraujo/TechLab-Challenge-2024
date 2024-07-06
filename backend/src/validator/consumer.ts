"use strict";

import { celebrate, Segments, Joi } from "celebrate";
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
                firstName: Joi.string(),
                lastName: Joi.string(),
                document: Joi.string().required(),
            },
        }, { messages: customMessages });
    },

    sigIn() {
        return celebrate({
            [Segments.BODY]: {
                document: Joi.string().required(),
            },
        }, { messages: customMessages });
    },
}