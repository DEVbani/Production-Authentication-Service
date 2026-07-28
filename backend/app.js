import dotenv from "dotenv";
dotenv.config();
import express from "express";
//routes
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();

app.use(express.json());
app.use(healthRoute);
app.use("/auth", authRoutes);
export default app;
