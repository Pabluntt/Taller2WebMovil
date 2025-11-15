const API_BASE = "http://localhost:8000/api/onepiece";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) {
    let msg;
    try { msg = await res.json(); } catch { msg = await res.text(); }
    throw new Error(`${res.status} ${JSON.stringify(msg)}`);
  }
  return res.json();
}

let gearsCache = [];
let orderAsc = false;

function sortByUses(items, asc) {
  return [...items].sort((a, b) => {
    const aU = Number(a?.count_technique ?? 0);
    const bU = Number(b?.count_technique ?? 0);
    return asc ? aU - bU : bU - aU;
  });
}

function renderList(items) {
  const ul = document.getElementById("list");
  if (!ul) return;
  ul.innerHTML = items.map(i => `
    <li>
      <strong>${i.name}</strong> (id: ${i.id})<br/>
      Usos: ${i.count_technique}<br/>
      <small>${i.description}</small>
    </li>
  `).join("");
}

function updateButtonText() {
  const btn = document.getElementById("btnToggleOrder");
  if (btn) btn.textContent = `Orden: ${orderAsc ? "Ascendente" : "Descendente"}`;
}

document.getElementById("btnToggleOrder")?.addEventListener("click", () => {
  orderAsc = !orderAsc;
  updateButtonText();
  renderList(sortByUses(gearsCache, orderAsc));
});

async function init() {
  try {
    gearsCache = await fetchJSON(`${API_BASE}/gears`);
    updateButtonText();
    renderList(sortByUses(gearsCache, orderAsc));
  } catch (e) {
    alert("Error cargando datos. ¿Está corriendo el backend FastAPI?");
    console.error(e);
  }
}

init();