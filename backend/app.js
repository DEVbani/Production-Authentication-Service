import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
//routes
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(healthRoute);
app.use("/auth", authRoutes);
app.use(errorHandler);
export default app;
