"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConsumersController } from "../controllers/ConsumersController.js";


const router = Router();
const URL = "/consumers";

// Authentication login
router.post(URL + "/sign-in", _catch((req, res, next) => {
    singleton(AuthenticationController).signInConsumer(req, res).catch(next)
  })
);

// create consumer
router.post(URL,
  _catch((req, res, next) => {
    singleton(ConsumersController).createAdmin(req, res, next).catch(next)
  })
);

// register consumer
router.post(URL + "/register",
  _catch((req, res, next) => {
    singleton(ConsumersController).register(req, res, next).catch(next)
  })
);

// update consumer
router.put(URL,
  _catch((req, res, next) => {
    singleton(ConsumersController).update(req, res, next).catch(next)
  })
);

// patch consumer
router.patch(URL,
  _catch((req, res, next) => {
    singleton(ConsumersController).patch(req, res, next).catch(next)
  })
);

// list consumers
router.get(URL, 
  _catch((req, res, next) => {
    singleton(ConsumersController).find(req, res, next).catch(next)
  })
);

// get consumer
router.get(URL + "/:id",
  _catch((req, res, next) => {
    singleton(ConsumersController).findOne(req, res, next).catch(next)
  })
);

// delete consumer
router.delete(URL,
  _catch((req, res, next) => {
    singleton(ConsumersController).delete(req, res, next).catch(next)
  })
);


export default router