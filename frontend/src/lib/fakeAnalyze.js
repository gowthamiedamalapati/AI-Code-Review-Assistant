export function fakeAnalyzeCode(userCode) {
  const recommendations = [
    {
      title: "Use const/let instead of var",
      details: "Prefer block-scoped declarations (const for values that don't change).",
      exampleBefore: "var total = 0;",
      exampleAfter: "let total = 0;",
    },
    {
      title: "Avoid repeated work",
      details: "Cache computed values and avoid running the same loop twice.",
      exampleBefore: "for (...) { /* compute */ }\nfor (...) { /* compute again */ }",
      exampleAfter: "const cached = computeOnce(items);\nuse(cached);",
    },
    {
      title: "Prefer === over ==",
      details: "Strict equality prevents unexpected type coercion.",
      exampleBefore: "if (x == '5') { ... }",
      exampleAfter: "if (x === 5) { ... }",
    },
  ];

  const corrections = [
    { line: 1, message: "Missing semicolon at end of line.", suggestion: ";" },
    { line: 3, message: "Unused variable 'temp'.", suggestion: "Remove or use 'temp'." },
  ];

  return { recommendations, corrections, lines: userCode.split(/\r?\n/).length };
}
