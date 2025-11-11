import 'dotenv/config';
import { upsertPattern } from "../src/patterns.js";

await upsertPattern({
  id: "sql-injection-js-1",
  text: "Concatenating user-provided id into SQL query string",
  metadata: {
    language: "js",
    tag: "sql-injection",
    summary: "Risk: SQL injection from string concatenation; fix with parameterized queries."
  }
});

console.log("Seeded patterns.");
process.exit(0);
