"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";


const router = Router();
const URL = "/auth/sign-in";

// Cadastro de usuário
router.post(URL, singleton(AuthenticationController).signIn);

export default router;