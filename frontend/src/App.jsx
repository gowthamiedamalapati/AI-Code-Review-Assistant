// import { useState, useEffect } from "react";
// import CodeForm from "./components/CodeForm.jsx";
// import ResultPanel from "./components/ResultPanel.jsx";
// import { analyze, fix } from "./lib/api.js";

// export default function App() {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [lastInput, setLastInput] = useState(null); // remember last analyzed input
//   const [apiStatus, setApiStatus] = useState("checking...");


//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await health();
//         setApiStatus(res.ok ? "online" : "unhealthy");
//       } catch {
//         setApiStatus("offline");
//       }
//     })();
//   }, []);
//   // 🔹 Analyze button handler
//   const handleAnalyze = async ({ code, language, filename }) => {
//     setLoading(true);
//     setResult(null);
//     setError("");
//     setLastInput({ code, language, filename });

//     try {
//       const res = await analyze(code, language, filename);
//       // Backend returns: { ok, review: { raw, structured } }
//       setResult({ mode: "review", data: res.review });
//     } catch (e) {
//       setError(e.message || "Analyze failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Fix button handler
//   const handleFix = async () => {
//     if (!lastInput) return;
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fix(lastInput.code, lastInput.language, lastInput.filename);
//       // Backend returns: { ok, code }
//       setResult({ mode: "fix", data: { code: res.code } });
//     } catch (e) {
//       setError(e.message || "Fix failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4 text-indigo-600">
//           Code Helper
//         </h1>

//         {/* 🔹 Code Input Form */}
//         <CodeForm
//           onAnalyze={handleAnalyze}
//           onFix={handleFix}       // ✅ enable Fix button in form too
//           isSubmitting={loading}
//         />

//         {/* 🔹 Error Message */}
//         {error && <div className="text-red-600 mb-3">{error}</div>}

//         {/* 🔹 Result Display */}
//         <ResultPanel
//           loading={loading}
//           result={result}
//           onFix={handleFix}      // ✅ Fix button in review result
//         />
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import CodeForm from "./components/CodeForm.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import { analyze, fix, health } from "./lib/api.js"; // ✅ make sure health is imported

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [lastInput, setLastInput] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking...");

  useEffect(() => {
    (async () => {
      try {
        const res = await health();
        setApiStatus(res.ok ? "online" : "unhealthy");
      } catch {
        setApiStatus("offline");
      }
    })();
  }, []);

  const handleAnalyze = async ({ code, language, filename }) => {
    setLoading(true);
    setResult(null);
    setError("");
    setLastInput({ code, language, filename });

    try {
      const res = await analyze(code, language, filename);
      setResult({ mode: "review", data: res.review });
    } catch (e) {
      setError(e.message || "Analyze failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async () => {
    if (!lastInput) return;
    setLoading(true);
    setError("");

    try {
      const res = await fix(lastInput.code, lastInput.language, lastInput.filename);
      setResult({ mode: "fix", data: { code: res.code } });
    } catch (e) {
      setError(e.message || "Fix failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 text-gray-900 py-10">
      {/* Center container */}
      <div className="w-full max-w-3xl px-6">
        <h1 className="text-2xl font-bold mb-4 text-indigo-600 text-center">
          Code Helper
        </h1>

        {/* API Status */}
        <div className="text-sm text-gray-600 mb-4 text-center">
          Backend:{" "}
          <span
            className={
              apiStatus === "online"
                ? "text-green-600"
                : apiStatus === "unhealthy"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {apiStatus}
          </span>
        </div>

        {/* Code Input Form */}
        <CodeForm
          onAnalyze={handleAnalyze}
          onFix={handleFix}
          isSubmitting={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="text-red-600 mb-3 text-center">{error}</div>
        )}

        {/* Result Display */}
        <ResultPanel
          loading={loading}
          result={result}
          onFix={handleFix}
        />
      </div>
    </div>
  );
}

