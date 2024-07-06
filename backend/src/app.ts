"use strict";

import cors from "cors";
import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";
import database from "./services/database.js";
import { errorHandler } from "./services/errorHandler.js";
import { errors } from "celebrate";


// EXPRESS
const app: express.Express = express();

// DAtABASE
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

// CORS
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "Referer",
    "User-Agent",
    "X-KL-Ajax-Request",
    "Authorization",
    "X-Requested-With",
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Accept",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
};

app.use(cors(options));
app.use(express.json());
app.disable("x-powered-by");
app.use("/api", routes);

// ERROR MESSAGE PADRONIZATION
app.use(errors());
app.use(errorHandler);

// setTimeout(() => {

// }, 100);


export default app;
