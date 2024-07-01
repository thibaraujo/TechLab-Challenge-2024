"use strict";

import cors from "cors";
import "dotenv/config";
import express from "express";
import routes from "./routes/index.js";

// EXPRESS
const app: express.Express = express();

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


export default app;
