import express from "express";
import { getNews } from "../services/news.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await getNews();
    res.json(data);
  } catch (err) {
    console.error("News error:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;