"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";


const router = Router();
const URL = "/auth/sign-in";

// Cadastro de usuário
router.get(URL, async (req, res, next) => {
    try {
        console.log("POST /auth/sign-in");
        res.status(200).json({ message: "POST /auth/sign-in" });
    } catch (error) {
        next(error);
    }
})

export default router