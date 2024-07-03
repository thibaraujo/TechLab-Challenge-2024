"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConversationsController } from "../controllers/ConversationsController.js";
import { scope } from "../middlewares/scope.js";


const router = Router();
const URL = "/conversations";

// create conversation
router.post(URL,
  _catch((req, res, next) => {
    singleton(ConversationsController).create(req, res, next).catch(next)
  })
);

// list conversations
router.get(URL, 
  _catch((req, res, next) => {
    singleton(ConversationsController).find(req, res, next).catch(next)
  })
);

// get conversation
router.get(URL + "/:id",
  _catch((req, res, next) => {
    singleton(ConversationsController).findOne(req, res, next).catch(next)
  })
);

// delete conversation
router.delete(URL,
  _catch((req, res, next) => {
    singleton(ConversationsController).delete(req, res, next).catch(next)
  })
);


export default router