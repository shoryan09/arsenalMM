import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchData } from "./embeddings.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const llm = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function answerQuestion(question) {
  // 1. Find relevant Arsenal data using vector search
  const relevantData = await searchData(question, 6);

  // 2. Build context string from retrieved data
  const context = relevantData
    .map((d, i) => `[Context ${i + 1}]: ${d.text}`)
    .join("\n\n");

  // 3. Build prompt with strict instructions
  const prompt = `You are an Arsenal FC expert assistant for "Gunners Hub".

Rules:
1. Answer ONLY using the provided context. Do not use outside knowledge.
2. If the context doesn't contain the answer, say "I don't have that information yet."
3. Keep answers concise (2-3 sentences max).
4. Be friendly and conversational, like a knowledgeable Arsenal fan.
5. Never invent statistics, dates, or scores.

Context about Arsenal:

${context}

Question: ${question}

Answer:`;

  // 4. Ask Gemini to generate the answer
  const result = await llm.generateContent(prompt);
  const answer = result.response.text();

  return {
    answer: answer.trim(),
    sources: [...new Set(relevantData.map(d => d.type))],
  };
}