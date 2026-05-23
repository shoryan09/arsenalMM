import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX_NAME);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function embedText(text, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await embedModel.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      });
      return result.embedding.values;
    } catch (err) {
      const isRateLimit = err.message?.includes("429") || err.message?.includes("quota");

      if (isRateLimit && attempt < retries) {
        const waitMs = attempt * 5000;
        console.log(`Rate limited. Waiting ${waitMs / 1000}s before retry ${attempt + 1}/${retries}...`);
        await sleep(waitMs);
        continue;
      }

      if (attempt === retries) {
        console.error(`Embedding failed: ${err.message?.slice(0, 200)}`);
        return null;
      }
    }
  }
  return null;
}

export async function storeData(id, text, metadata = {}) {
  const embedding = await embedText(text);
  if (!embedding) return;
  await index.upsert({
    records: [{
      id,
      values: embedding,
      metadata: { text, ...metadata },
    }]
  });
}

export async function bulkStoreData(items) {
  const vectors = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const embedding = await embedText(item.text);

    if (embedding) {
      vectors.push({
        id: item.id,
        values: embedding,
        metadata: { text: item.text, ...item.metadata },
      });
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  Embedded ${i + 1}/${items.length}`);
    }

    await sleep(500);
  }

  if (vectors.length === 0) {
    console.warn("No valid embeddings to store, skipping upsert");
    return;
  }

  console.log(`Upserting ${vectors.length} vectors to Pinecone...`);
  await index.upsert({ records: vectors });
}

export async function searchData(query, topK = 5) {
  const queryEmbedding = await embedText(query);
  if (!queryEmbedding) throw new Error("Failed to embed query");

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });
  return results.matches.map(m => ({
    text: m.metadata.text,
    score: m.score,
    type: m.metadata.type,
  }));
}