const API_BASE = "http://localhost:5000/api/onepiece";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) {
    let msg;
    try { msg = await res.json(); } catch { msg = await res.text(); }
    throw new Error(`${res.status} ${JSON.stringify(msg)}`);
  }
  return res.json();
}