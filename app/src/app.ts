import express from "express";
import * as dotenv from "dotenv";
import { helloWorldRouter, githubRouter } from "./routes";

dotenv.config();
const app = express();

app.use("/", helloWorldRouter);
app.use("/github", githubRouter);

app.use((req, res, next) => {
  res.json({
    error: `${req.url} - does not exist.`,
    statusCode: 404,
  });
});

export default app;
