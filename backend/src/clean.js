// Remove ``` fences if the model adds them
export function stripCodeFences(text = "") {
  let t = (text || "").trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z0-9_-]*\s*\n/, ""); // remove opening ``` or ```lang
    t = t.replace(/\n?```$/, "");                 // remove trailing ```
  }
  return t.trim();
}
