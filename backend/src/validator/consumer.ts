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
                firstName: Joi.string(),
                lastName: Joi.string(),
                document: Joi.string().required(),
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