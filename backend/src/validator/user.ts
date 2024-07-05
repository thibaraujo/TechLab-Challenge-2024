"use strict";

import { celebrate, Segments, Joi } from "celebrate";
import { Profile } from "../entities/User.js";

export default {
    get() {
        return celebrate({
            [Segments.QUERY]: {
                id: Joi.string().length(24).hex(),
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
                profile: Joi.string()
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