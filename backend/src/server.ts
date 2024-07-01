"use strict"

import app from "./app.js";
import { APP_PORT } from "./constants/env.js";

app.listen(APP_PORT, () => {
  console.log(`server is running on port ${APP_PORT}`)
})
