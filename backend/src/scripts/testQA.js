import "dotenv/config";
import { answerQuestion } from "../services/qa.js";

const questions = [
  "Who is Arsenal manager?",
  "When is the next match?",
  "Tell me about Bukayo Saka",
];

for (const q of questions) {
  console.log(`\nQ: ${q}`);
  const result = await answerQuestion(q);
  console.log(`A: ${result.answer}`);
  console.log(`Sources: ${result.sources.join(", ")}`);
}

process.exit(0);