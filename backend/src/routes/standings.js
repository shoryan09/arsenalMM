import express from "express";
import { getStandings } from "../services/footballData.js";

const router = express.Router();

router.get("/:competition", async (req, res) => {
  try {
    const data = await getStandings(req.params.competition);
    res.json(data);
  } catch (err) {
    console.error("Standings error:", err.message);
    res.status(500).json({ error: "Failed to fetch standings" });
  }
});

export default router;