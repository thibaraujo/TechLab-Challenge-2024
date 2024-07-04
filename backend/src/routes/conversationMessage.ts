"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { scope } from "../middlewares/scope.js";
import { ConversationMessagesController } from "../controllers/ConversationMessages.js";
import authentication from "../services/authentication.js";


const router = Router();
const URL = "/conversationMessages";

// Authentication login
router.post("/auth/sign-in", 
  _catch((req, res, next) => {
    singleton(AuthenticationController).signIn(req, res).catch(next)
  })
);

// create conversationMessage
router.post(URL,
  // authentication.userMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).createAdmin(req, res, next).catch(next)
  })
);


// update conversationMessage
router.put(URL,
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).update(req, res, next).catch(next)
  })
);

// list conversationMessages
router.get(URL, 
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).find(req, res, next).catch(next)
  })
);

// get conversationMessage
router.get(URL + "/:id",
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).findOne(req, res, next).catch(next)
  })
);

// delete conversationMessage
router.delete(URL,
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).delete(req, res, next).catch(next)
  })
);


export default router