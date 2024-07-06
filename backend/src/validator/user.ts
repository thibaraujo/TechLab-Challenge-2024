"use strict";

import { celebrate, Segments, Joi } from "celebrate";
import { Profile } from "../entities/User.js";

export default {
    get() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
                available: Joi.string().valid("true", "false"),
            },
        });
    },

    post() {
        return celebrate({
            [Segments.BODY]: {
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                profile: Joi.string().valid(...Object.values(Profile)).required(),
                available: Joi.boolean().default(true),
            },
        });
    },

    put() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
            },
            [Segments.BODY]: {
                username: Joi.string(),
                email: Joi.string().email(),
                profile: Joi.string(),
                available: Joi.boolean().default(true),
            },
        });
    },

    patchAvailable() {
        return celebrate({
            [Segments.BODY]: {
                available: Joi.boolean().required()
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

    login() {
        return celebrate({
            [Segments.HEADERS]: Joi.alternatives().try(
                Joi.object().keys({
                    authorization : Joi.string().regex(/\b(Basic)\b/i),
                }).unknown(true),
                Joi.object().keys({
                    authorization : Joi.string().regex(/\b(Bearer)\b/i),
                }).unknown(true)
            ),
        });
    }
}