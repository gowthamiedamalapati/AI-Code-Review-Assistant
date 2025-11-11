import Spinner from "./Spinner.jsx";

export default function ResultPanel({ loading, result, onFix }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        <span className="text-sm text-gray-700">Processing…</span>
      </div>
    );
  }

  if (!result) return null;

  // 🔹 When showing analysis results
  if (result.mode === "review") {
    const { raw, structured = [] } = result.data || {};
    return (
      <section className="space-y-4">
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Review</h2>
          {structured.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {structured.map((sec, i) => (
                <li key={i} className="whitespace-pre-wrap text-sm text-gray-800">
                  {sec}
                </li>
              ))}
            </ul>
          ) : (
            <pre className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
              {raw}
            </pre>
          )}
        </div>

        <button
          onClick={onFix}
          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow"
        >
          Fix Code
        </button>
      </section>
    );
  }

  // 🔹 When showing fixed code
  if (result.mode === "fix") {
    return (
      <section className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-2 text-green-700">Fixed Code</h2>
        <pre className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm overflow-auto">
          {result.data.code}
        </pre>
      </section>
    );
  }

  return null;
}
