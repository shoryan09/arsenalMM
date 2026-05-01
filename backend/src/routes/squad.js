import express from "express";
import { getSquad } from "../services/footballData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await getSquad();
    res.json(data);
  } catch (err) {
    console.error("Squad error:", err.message);
    res.status(500).json({ error: "Failed to fetch squad" });
  }
});

export default router;