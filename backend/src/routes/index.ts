"use strict";
import { Router } from "express";

const router = Router();

import userRouter from './user.js';
router.use(userRouter);

import conversationRouter from './conversation.js';
router.use(conversationRouter);

export default router;

