import express from "express";
import { getNextMatch, getFixtures, getResults } from "../services/footballData.js";

const router = express.Router();

router.get("/next", async (req, res) => {
  try {
    const data = await getNextMatch();
    res.json(data);
  } catch (err) {
    console.error("Next match error:", err.message);
    res.status(500).json({ error: "Failed to fetch next match" });
  }
});

router.get("/fixtures", async (req, res) => {
  try {
    const data = await getFixtures();
    res.json(data);
  } catch (err) {
    console.error("Fixtures error:", err.message);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
});

router.get("/results", async (req, res) => {
  try {
    const data = await getResults();
    res.json(data);
  } catch (err) {
    console.error("Results error:", err.message);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

export default router;