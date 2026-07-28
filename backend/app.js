import express from "express";
import dotenv from "dotenv";
//routes
import healthRoute from "./routes/healthRoute.js";

const app = express();
dotenv.config();

app.use(healthRoute);
app.listen(process.env.PORT, () => {
  console.log(`Port running on ${process.env.PORT}`);
});
