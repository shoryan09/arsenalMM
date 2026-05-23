import express from "express";
import { answerQuestion } from "../services/qa.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: "Question is too short" });
    }

    if (question.length > 500) {
      return res.status(400).json({ error: "Question is too long" });
    }

    const result = await answerQuestion(question);
    res.json(result);
  } catch (err) {
    console.error("Q&A error:", err.message);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

export default router;