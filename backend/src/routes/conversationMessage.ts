"use strict";
import { Router } from "express";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConversationMessagesController } from "../controllers/ConversationMessages.js";
import validator from "../validator/conversationMessage.js";
import { celebrateErrorHandler } from "../services/errorHandler.js";

const router = Router();
const URL = "/conversationMessages";


router.post(URL,
  validator.post(),
  celebrateErrorHandler,
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).create(req, res, next).catch(next)
  })
);

router.get(URL, 
  validator.get(),
  celebrateErrorHandler,
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).find(req, res, next).catch(next)
  })
);

export default router