import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { validateAnalyzeRequest } from "./validators.js";
// import { llmPing } from './llm.js';
import { analyzeCode,fixCode } from "./llm.js";


const app = express();

app.use(express.json({ limit: process.env.MAX_INPUT_BYTES ? `${process.env.MAX_INPUT_BYTES}b` : '100kb' }));
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// app.get("/llm-ping",async (req, res) => {
//     try{
//         const text = await llmPing();
//         return res.json({ok: true, text });
//     }catch (err) {
//         console.error(" LLM PING ERROR:", err);
//         return res.status(500).json({ok: false, error:"LLM ping Failed"});
//     }
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

app.post("/analyze", async (req, res) => {
  const v = validateAnalyzeRequest(req.body);
  if (!v.ok) return res.status(400).json({ ok: false, error: v.error });

  const { code, language, filename } = v.data;

  try {
    const result = await analyzeCode({ code, language, filename });
    return res.json({ ok: true, review: result });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return res.status(500).json({ ok: false, error: "analyze failed" });
  }
});


app.post("/fix", async (req, res) => {
  const v = validateAnalyzeRequest(req.body);
  if (!v.ok) return res.status(400).json({ ok: false, error: v.error });

  const { code, language, filename } = v.data;

  try {
    const fixed = await fixCode({ code, language, filename });
    return res.json({ ok: true, code: fixed });
  } catch (err) {
    console.error("FIX ERROR:", err);
    return res.status(500).json({ ok: false, error: "fix failed" });
  }
});
