import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "./config.js";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY missing in .env");
}

export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Ensures a serverless index exists with correct dims
export async function ensureIndex(dimension = 1536) {
  const name = process.env.PINECONE_INDEX;
  const cloud = process.env.PINECONE_CLOUD;
  const region = process.env.PINECONE_REGION;

  const existing = await pc.listIndexes();
  if (!existing.indexes?.some(ix => ix.name === name)) {
    await pc.createIndex({
      name,
      dimension,
      metric: "cosine",
      spec: { serverless: { cloud, region } },
    });
  }
  return pc.index(name);
}
