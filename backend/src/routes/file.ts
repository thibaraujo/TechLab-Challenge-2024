"use strict"

import { Router } from "express";
import multer from 'multer';
import { _catch } from "../middlewares/catch.js";
import { singleton } from "../tools/singleton.js";
import { FilesController } from "../controllers/file.js";

const router = Router();
const URL = "/files";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(URL,
    upload.single("file"),
    _catch((req, res, next) => {
        singleton(FilesController).upload(req, res, next).catch(next)
    })
);

router.get(URL,
    _catch((req, res, next) => {
        singleton(FilesController).recover(req, res, next).catch(next)
    })
);


export default router;