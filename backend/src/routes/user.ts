"use strict";
import { Router } from "express";
import { AuthenticationController } from "../controllers/AuthenticationController.js";
import { singleton } from "../tools/singleton.js";
import { _catch } from "../middlewares/catch.js";
import { UsersController } from "../controllers/UsersController.js";
import authentication from "../services/authentication.js";
import validator from "../validator/user.js";


const router = Router();
const URL = "/users";

router.post("/auth/sign-in", validator.login(), _catch((req, res, next) => {
    singleton(AuthenticationController).signIn(req, res).catch(next)
  })
);

router.post(URL,
  validator.post(),
  authentication.sudoMiddleware,
  _catch((req, res, next) => {
    singleton(UsersController).createAdmin(req, res, next).catch(next)
  })
);

// router.post(URL + "/register",
//   _catch((req, res, next) => {
//     singleton(UsersController).register(req, res, next).catch(next)
//   })
// );

router.put(URL,
  validator.put(),
  authentication.standardMiddleware,
  _catch((req, res, next) => {
    singleton(UsersController).update(req, res, next).catch(next)
  })
);

router.patch(URL,
  validator.put(),
  authentication.standardMiddleware,
  _catch((req, res, next) => {
    singleton(UsersController).patch(req, res, next).catch(next)
  })
);

router.get(URL, 
  validator.get(),
  authentication.sudoMiddleware,
  _catch((req, res, next) => {
    singleton(UsersController).find(req, res, next).catch(next)
  })
);

router.get(URL + "/:id",
  validator.get(),
  authentication.standardMiddleware,
  _catch((req, res, next) => {
    singleton(UsersController).findOne(req, res, next).catch(next)
  })
);

router.delete(URL,
  validator.delete(),
  authentication.sudoMiddleware,
  _catch((req, res, next) => {
    singleton(UsersController).delete(req, res, next).catch(next)
  })
);

export default router