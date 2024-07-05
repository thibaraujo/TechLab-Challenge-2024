"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { ConsumersController } from "../controllers/ConsumersController.js";
import validator from "../validator/consumer.js";


const router = Router();
const URL = "/consumers";

router.post(URL + "/sign-in", validator.sigIn(), _catch((req, res, next) => {
    singleton(AuthenticationController).signInConsumer(req, res).catch(next)
  })
);

// router.post(URL,
//   _catch((req, res, next) => {
//     singleton(ConsumersController).create(req, res, next).catch(next)
//   })
// );

// router.post(URL + "/register",
//   _catch((req, res, next) => {
//     singleton(ConsumersController).register(req, res, next).catch(next)
//   })
// );

// router.put(URL,
//   _catch((req, res, next) => {
//     singleton(ConsumersController).update(req, res, next).catch(next)
//   })
// );

// router.patch(URL,
//   _catch((req, res, next) => {
//     singleton(ConsumersController).patch(req, res, next).catch(next)
//   })
// );

// router.get(URL, 
//   _catch((req, res, next) => {
//     singleton(ConsumersController).find(req, res, next).catch(next)
//   })
// );

// router.get(URL + "/:id",
//   _catch((req, res, next) => {
//     singleton(ConsumersController).findOne(req, res, next).catch(next)
//   })
// );

// router.delete(URL,
//   _catch((req, res, next) => {
//     singleton(ConsumersController).delete(req, res, next).catch(next)
//   })
// );


export default router