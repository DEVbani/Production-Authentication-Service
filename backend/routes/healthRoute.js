import express from "express";
const router = express.Router();

router.get("/health", (req, res, next) => {
  return res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

export default router;