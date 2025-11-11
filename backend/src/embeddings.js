
import OpenAI from "openai";  
import { config } from "./config.js";  

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

// Export function to embed text/code
export async function embedText(text) {
  const model = process.env.EMBEDDING_MODEL || "text-embedding-3-small"; 
  const r = await openai.embeddings.create({
    model,
    input: text,
  });

  return r.data[0].embedding; // Array of numbers
}

// r looks like this so we return r.data[0].embeddings
// {
//   object: "list",
//   data: [
//     {
//       object: "embedding",
//       embedding: [0.011, -0.029, 0.777, ...],
//       index: 0
//     }
//   ]
// }
