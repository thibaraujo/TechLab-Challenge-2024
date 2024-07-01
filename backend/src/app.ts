"use strict";

import cors from "cors";
import "dotenv/config";
import express from "express";
import database from "./services/database.js";
import { AuthenticationController } from "./controllers/AuthenticationController.js";
import { singleton } from "./tools/singleton.js";
import { _catch } from "./middlewares/catch.js";
import Express, { ErrorRequestHandler } from 'express'
import { UserModel } from "./model/user.js";

// EXPRESS
export const app = Express();
// DATABASE
function connectionMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  database.connect()
    .then(() => {
      console.log("Database connected");
      next();
    })
    .catch((error) => {
      console.error("Error connecting to database: ", error);
      next(error);
    });
}
app.use(connectionMiddleware);
app.use(cors());
app.use(Express.json());

console.log('routes loaded')

app.post('/login', function(req, res){
  console.log('test');
  res.end(); 
});

app.use((req, res) => {
  res.status(404).send()
})

app.use(((error, req, res) => {
  console.error(error)

  if (!(error instanceof Error)) return res.status(500).json({ message: 'Internal Server Error' })

  res.status(500).json({ message: error.message })
}) as ErrorRequestHandler)

setTimeout(async () => {
  database.connect()
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Error connecting to database: ", error);;
    });
  const user = await UserModel.findOne({ email: "thiagobatistaaraujo06@gmail.com", deletedAt: null}).lean();
  console.log(user)
  if (!user) console.log('user not found')
  else
   console.log('user found')
}, 100)

export default app;
