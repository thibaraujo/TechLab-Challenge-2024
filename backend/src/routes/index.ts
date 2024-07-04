"use strict";
import { Router } from "express";

const router = Router();

import userRouter from './user.js';
router.use(userRouter);

import conversationRouter from './conversation.js';
router.use(conversationRouter);

import conversationMessageRouter from './conversationMessage.js';
router.use(conversationMessageRouter);

import consumerRouter from './consumer.js';
router.use(consumerRouter);

export default router;

