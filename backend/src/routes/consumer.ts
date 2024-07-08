"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConsumersController } from "../controllers/ConsumersController.js";
import validator from "../validator/consumer.js";
import authenticationConsumer from "../services/authenticationConsumer.js";
import { celebrateErrorHandler } from "../services/errorHandler.js";


const router = Router();
const URL = "/consumers";

router.post(URL + "/sign-in", validator.sigIn(), _catch((req, res, next) => {
    singleton(AuthenticationController).signInConsumer(req, res).catch(next)
  })
);

router.post(URL,
  validator.post(),
  celebrateErrorHandler,
  _catch((req, res, next) => {
    singleton(ConsumersController).create(req, res, next).catch(next)
  })
);

router.get(URL + "/:id",
  validator.get(),
  authenticationConsumer.consumerMiddleware,
  _catch((req, res, next) => {
    singleton(ConsumersController).findOne(req, res, next).catch(next)
  })
);


export default router