import express from "express";
import { helloWorldRouter } from "./routes";

const app = express();

app.get("/", helloWorldRouter);

export default app;
