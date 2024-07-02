"use strict";
import { NextFunction, Response, Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { UsersController } from "../controllers/UsersController.js";
import { scope } from "../middlewares/scope.js";


const router = Router();
const URL = "/users";

// Authentication login
router.post("/auth/sign-in", _catch((req, res, next) => {
    singleton(AuthenticationController).signIn(req, res).catch(next)
  })
);

// create user
router.post(URL,
  _catch((req, res, next) => {
    singleton(UsersController).saveAdmin(req, res, next).catch(next)
  })
);

// update user
router.put(URL,
  _catch((req, res, next) => {
    singleton(UsersController).update(req, res, next).catch(next)
  })
);

// list users
router.get(URL, 
  _catch((req, res, next) => {
    singleton(UsersController).find(req, res, next).catch(next)
  })
);


export default router