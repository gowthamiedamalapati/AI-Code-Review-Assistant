import { Pinecone } from "@pinecone-database/pinecone";
import { embedText } from "./embeddings.js";
import { ensureIndex } from "./pine.js";

// const {
//   PINECONE_API_KEY, PINECONE_INDEX, PINECONE_CLOUD, PINECONE_REGION
// } = process.env;

// const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

// export async function ensureIndex(dimension = 1536) {
//   const list = await pc.listIndexes();
//   const has = list.indexes?.some(ix => ix.name === PINECONE_INDEX);
//   if (!has) {
//     await pc.createIndex({
//       name: PINECONE_INDEX,
//       dimension,
//       metric: "cosine",
//       spec: { serverless: { cloud: PINECONE_CLOUD, region: PINECONE_REGION } }
//     });
//   }
//   return pc.index(PINECONE_INDEX);
// }

export async function findSimilarPatterns({ text, topK = 3, filter = {} }) {
  const index = await ensureIndex(1536);
  const vector = await embedText(text);

  const res = await index.query({
    vector,
    topK,
    includeMetadata: true,
    filter,             
  });

  return (res.matches || []).map(m => ({
    id: m.id,
    score: m.score,
    metadata: m.metadata || {}
  }));
}
