"use strict";

import { celebrate, Segments, Joi } from "celebrate";

export default {
    get() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
                consumer: Joi.string().length(24).hex(),
            },
        });
    },

    post() {
        return celebrate({
            [Segments.BODY]: {
                subject: Joi.string().required(),
                consumer: Joi.string().length(24).hex().required(),
                user: Joi.string().length(24).hex(),
            },
        });
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
        });
    },

    delete() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
            },
        });
    },
}