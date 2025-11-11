const API = import.meta.env.VITE_API_URL;

export async function health() {
  const r = await fetch(`${API}/health`);
  if (!r.ok) throw new Error(`Health failed: ${r.status}`);
  return r.json(); // { ok: true, uptime: ... }
}

export async function analyze(code, language = "js", filename = "") {
  const r = await fetch(`${API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, filename })
  });
  if (!r.ok) throw new Error(`Analyze failed: ${r.status}`);
  return r.json(); // { ok, review: { raw, structured } }
}

export async function fix(code, language = "js", filename = "") {
  const r = await fetch(`${API}/fix`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, filename })
  });
  if (!r.ok) throw new Error(`Fix failed: ${r.status}`);
  return r.json(); // { ok, code }
}
