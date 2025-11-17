// API de One Piece - Backend FastAPI local
const API_BASE = "http://10.0.2.2:8000/api/onepiece/gears";

async function fetchJSON(url, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json"
  };
  
  const res = await fetch(url, { 
    headers: { ...defaultHeaders, ...(options.headers || {}) }, 
    ...options 
  });
  
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
    <li class="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg p-6 flex flex-col">
      <h3 class="text-xl font-bold text-yellow-300 mb-2">${i.name}</h3>
      <p class="text-gray-300 flex-grow">${i.description}</p>
      <p class="text-indigo-300 font-semibold mt-4">Técnicas: ${i.count_technique}</p>
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
    gearsCache = await fetchJSON(API_BASE);
    updateButtonText();
    renderList(sortByUses(gearsCache, orderAsc));
  } catch (e) {
    console.error('Error cargando datos de One Piece:', e);
    const ul = document.getElementById("list");
    if (ul) {
      ul.innerHTML = '<li class="text-center text-red-300">Error al cargar los datos. Verifica la conexión.</li>';
    }
  }
}

init();
