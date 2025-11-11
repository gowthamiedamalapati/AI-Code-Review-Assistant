import { useState } from "react";

export default function CodeForm({ onAnalyze, isSubmitting }) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("js");
  const [filename, setFilename] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;
    onAnalyze({ code, language, filename });
  };

  const isDisabled = isSubmitting || !code.trim();

  return (
    <form onSubmit={onSubmit} className="space-y-3 mb-6">
      <label className="block text-sm font-medium">Your code</label>
      <textarea
        className="w-full h-48 p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste code here..."
        disabled={isSubmitting}
      />

      <div className="flex gap-3">
        <input
          className="border rounded-xl p-2 flex-1"
          placeholder="Filename (optional)"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          disabled={isSubmitting}
        />
        <select
          className="border rounded-xl p-2"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
          <option value="ts">TypeScript</option>
        </select>
      </div>

      {/* ✅ Only one main action button */}
      <button
        type="submit"
        disabled={isDisabled}
        className={`px-4 py-2 rounded-xl text-white shadow ${
          isDisabled
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isSubmitting ? "Analyzing…" : "Analyze"}
      </button>
    </form>
  );
}
