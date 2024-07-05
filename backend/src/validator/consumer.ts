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

    sigIn() {
        return celebrate({
            [Segments.BODY]: {
                document: Joi.string().required(),
            },
        });
    },
}