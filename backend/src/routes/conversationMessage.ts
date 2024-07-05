"use strict";
import { Router } from "express";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConversationMessagesController } from "../controllers/ConversationMessages.js";
import validator from "../validator/conversationMessage.js";

const router = Router();
const URL = "/conversationMessages";


router.post(URL,
  validator.post(),
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).create(req, res, next).catch(next)
  })
);

router.get(URL, 
  validator.get(),
  _catch((req, res, next) => {
    singleton(ConversationMessagesController).find(req, res, next).catch(next)
  })
);

// // update conversationMessage
// router.put(URL,
//   _catch((req, res, next) => {
//     singleton(ConversationMessagesController).update(req, res, next).catch(next)
//   })
// );

// // get conversationMessage
// router.get(URL + "/:id",
//   _catch((req, res, next) => {
//     singleton(ConversationMessagesController).findOne(req, res, next).catch(next)
//   })
// );

// // delete conversationMessage
// router.delete(URL,
//   _catch((req, res, next) => {
//     singleton(ConversationMessagesController).delete(req, res, next).catch(next)
//   })
// );


export default router