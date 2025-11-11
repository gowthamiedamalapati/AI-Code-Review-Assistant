// import OpenAI from "openai";
// import { config } from "./config.js";
// import { findSimilarPatterns } from "./patterns.js";


// if (!config.OPENAI_API_KEY) {
//     throw new Error("OPENAI_API_KEY is missing.");
// }

// export const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY});

// export async function llmPing() {
//     const r = await openai.responses.create({
//         model: config.MODEL_CODE_REVIEW,
//         input: "reply with single word: pong",
//     });
//     return r.output_text?.trim();
// }

// export async function analyzeCode({ code, language, filename }) {
//   // 1) Retrieve similar patterns (RAG step)
//   const similar = await findSimilarPatterns({
//     text: code,
//     topK: 3,
//     filter: { language }, // optional filter
//   });

//   const contextBlock = similar.length
//     ? [
//         "Similar patterns (from knowledge base):",
//         ...similar.map((m, i) => `- [${i+1}] ${m.metadata?.tag || m.id}: ${m.metadata?.summary || ""}`),
//         "",
//       ].join("\n")
//     : "Similar patterns: none\n";

//   // 2) Build concise prompt
//   const prompt = `
// You are a senior ${language.toUpperCase()} engineer.
// Use the similar patterns (if any) to inform your review, but do not hallucinate.

// ${contextBlock}
// Filename: ${filename || "unknown"}

// CODE:
// ${code}

// Provide:
// 1) Bugs/correctness
// 2) Security risks
// 3) Performance
// 4) Best-practice/style
// 5) Minimal improved snippet

// Be concise and actionable. Use bullet points. If none, say "none".
// `.trim();

//   // 3) Call model
//   const r = await openai.responses.create({
//     model: config.MODEL_CODE_REVIEW,
//     input: prompt,
//   });

//   return r.output_text?.trim() || "";
// }


import OpenAI from "openai";
import { config } from "./config.js";
import { findSimilarPatterns } from "./patterns.js";
import { stripCodeFences } from "./clean.js";

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

export async function analyzeCode({ code, language, filename }) {
  // 1) Retrieve similar patterns from Pinecone
  const similar = await findSimilarPatterns({
    text: code,
    topK: 3,
    filter: { language }   
  });

  const contextLines = similar.length
    ? similar.map((m, i) =>
        `- [${i + 1}] ${m.metadata?.tag || m.id}: ${m.metadata?.summary || ""}`
      ).join("\n")
    : "none";

  // 2) Build an augmented prompt for the model
  const prompt = `
You are a senior ${language.toUpperCase()} engineer. Use the retrieved patterns (if any) to guide a precise code review.

Retrieved patterns:
${contextLines}

Filename: ${filename || "unknown"}
CODE:
${code}

Provide:
1) Bugs / correctness
2) Security risks
3) Performance problems
4) Best-practice/style issues
5) Minimal improved snippet

Be concise and actionable.
`.trim();

  const r = await openai.responses.create({
    model: config.MODEL_CODE_REVIEW, 
    input: prompt,
  });

  // return (r.output_text || "").trim();
  const output = (r.output_text || "").trim();

  // Split markdown into sections by headings
  const sections = output.split(/^###\s+/m)
    .filter(Boolean)
    .map(s => s.trim());

  return {
    raw: output,
    structured: sections
  };
}


/**
 * Return RAW corrected code (no markdown, no commentary).
 */
export async function fixCode({ code, language = "js", filename = "" }) {
  const system = `
You are a senior ${language.toUpperCase()} engineer.
Fix the provided code to address bugs, security risks, performance issues, and style problems.
Keep the same public API and behavior unless it is unsafe.
Return ONLY the corrected code as raw text:
- no backticks
- no markdown
- no comments or explanations
If the input is already correct, return it unchanged.
  `.trim();

  const user = `
Filename: ${filename || "unknown"}
Language: ${language}

Code:
${code}
  `.trim();

  const r = await openai.responses.create({
    model: config.MODEL_CODE_REVIEW,  
    input: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
  });

  const out = (r.output_text || "").trim();
  return stripCodeFences(out);
}
