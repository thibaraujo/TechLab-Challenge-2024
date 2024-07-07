"use strict";
import { Router } from "express";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConversationsController } from "../controllers/ConversationsController.js";
import authentication from "../services/authentication.js";
import authenticationConsumer from "../services/authenticationConsumer.js";
import validator from "../validator/conversation.js";
import { celebrateErrorHandler } from "../services/errorHandler.js";


const router = Router();
const URL = "/conversations";

// create conversation - by consumer
router.post(URL,
  validator.post(),
  celebrateErrorHandler,
  authenticationConsumer.consumerMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationsController).create(req, res, next).catch(next)
  })
);

// list all conversations (only sudo)
router.get(URL, 
  validator.get(),
  celebrateErrorHandler,
  authentication.sudoMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationsController).find(req, res, next).catch(next)
  })
);

// list user conversations (all users)
router.get(URL + "/user", 
  validator.get(),
  celebrateErrorHandler,
  authentication.standardMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationsController).findMine(req, res, next).catch(next)
  })
);

// list consumer conversations
router.get(URL + "/consumers", 
  validator.get(),
  celebrateErrorHandler,
  authenticationConsumer.consumerMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationsController).findMine(req, res, next).catch(next)
  })
);

// get conversation by id
router.get(URL + "/:id",
  validator.get(),
  celebrateErrorHandler,
  _catch((req, res, next) => {
    singleton(ConversationsController).findOne(req, res, next).catch(next)
  })
);

// delete conversation
router.delete(URL,
  validator.delete(),
  celebrateErrorHandler,
  authentication.standardMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationsController).delete(req, res, next).catch(next)
  })
);

//distribute conversation
router.post(URL + "/distribute",
  authentication.sudoMiddleware,
  _catch((req, res, next) => {
    singleton(ConversationsController).distribute(req, res, next).catch(next)
  })
);


export default router