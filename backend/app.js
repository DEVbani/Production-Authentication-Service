import dotenv from "dotenv";
dotenv.config();
import express from "express";
//routes
import healthRoute from "./routes/healthRoute.js";

const app = express();

app.use(express.json());
app.use(healthRoute);

export default app;
