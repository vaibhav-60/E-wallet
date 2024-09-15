import express, { json } from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(json());

//import the routes

import userRouter from "./routes/user.routes.js";
import accountRouter from "./routes/accout.routes.js";
//routes declarations

app.use("/api/v1/users", userRouter);
app.use("/api/v1/account", accountRouter);

export { app };
