// Hace una solicitud fetch para sacar los tipos de los pokemon (filtrando los especiales),
//  los traduce yyy devuelve un Array de objetos
async function obtenerTiposPokemon() {
    const res = await fetch('https://pokeapi.co/api/v2/type');
    const data = await res.json();
    const tipos = data.results.filter(t => !['unknown', 'shadow', 'stellar'].includes(t.name));
    // Obtener nombres en español de cada tipo
    const tiposTraducidos = await Promise.all(
        tipos.map(async tipo => {
            const resTipo = await fetch(tipo.url);
            const dataTipo = await resTipo.json();
            // Busca el nombre en español
            const nombreES = dataTipo.names.find(n => n.language.name === 'es');
            return {
                name: tipo.name,
                nameES: nombreES ? nombreES.name : tipo.name
            };
        })
    );
    return tiposTraducidos;
}

// Plantea 6 tipos alteatorios de los existentes, los mezcla y los pasa como parametros para crear los divs de esos tipos
async function mostrarTiposAlAzar() {
    const tipos = await obtenerTiposPokemon();
    const tiposAzar = tipos
        .map(t => ({t, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({t}) => t)
        .slice(0, 6);
    await mostrarDivsPorTiposIndividuales(tiposAzar, tipos);
}

// Vacia el div existente (si es que llegaba a tener contenido anterior) y define el tipo que tendra cada div,
//de ahi llama a la construccion de las tarjetitas de cada Pokemon
async function mostrarDivsPorTiposIndividuales(listaTipos, tiposDisponibles) {
    const pokeSections = document.querySelector('#pokeSections');
    pokeSections.innerHTML = '';
    for (const tipo of listaTipos) {
        await cargarPokesPorTipoConSelector(tipo.name, tiposDisponibles, pokeSections, null, tipo.nameES);
    }
}

// Lo ma pesado de todo pq esta toda la logica aqui, vuelve a hacer una llamada de los tipos para ahora si 
// sacar Pokemon que tengan ese tipo (que le pasamos como parametro anteriormente),
// con todos sus datos correspondiente (nombre, imagen, tipos traducidos),
async function cargarPokesPorTipoConSelector(tipo, tiposDisponibles = [], contenedor = null, replaceDiv = null, tipoES = null) {
    if (!contenedor) contenedor = document.querySelector('#pokeSections');
    try {
        // Llamar a la API Express propia para obtener los pokemons por tipo.
        // Cambia `API_BASE` si apuntas a producción (ej. URL de Railway).
        const API_BASE = 'http://localhost:3002';
        const url = `${API_BASE}/pokemons?type=${encodeURIComponent(tipo)}&limit=6`;
        console.log('Cargando pokemons desde', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API responded with status ${res.status} ${res.statusText}`);
        const pokemons = await res.json();
        if (!Array.isArray(pokemons) || pokemons.length === 0) {
            console.warn('No se encontraron pokemons para el tipo', tipo, pokemons);
        }
        // pokemons viene ya con los campos: name, types, description, pokedex_number, image_url
        console.log('Pokemons recibidos (raw):', pokemons);
        const detalles = pokemons.map(p => ({
            nombre: p.name || p.nombre,
            imagen: p.image_url || p.imagen || '',
            tipos: p.types || p.tipos || [],
            pokedex_number: p.pokedex_number || p.order || null,
            descripcion: p.description || p.descripcion || ''
        }));
        // Deduplicar por pokedex_number o nombre (por si la API devuelve duplicados)
        const vistos = new Set();
        const detallesUnicos = [];
        for (const d of detalles) {
            const key = d.pokedex_number != null ? String(d.pokedex_number) : d.nombre.toLowerCase();
            if (!vistos.has(key)) {
                vistos.add(key);
                detallesUnicos.push(d);
            } else {
                console.warn('Duplicado filtrado en frontend:', key, d);
            }
        }

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-2xl mx-auto mb-8 relative';
        sectionDiv.style.maxWidth = '95vw';
        sectionDiv.style.width = '100%';
    // Botón y menú para cambiar el tipo de la sección
        const tipoSelectorDiv = document.createElement('div');
        tipoSelectorDiv.className = 'flex gap-2 items-center mb-4';
        const tipoBtn = document.createElement('button');
        tipoBtn.className = 'bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow hover:bg-yellow-500 transition';
        tipoBtn.textContent = `Cambiar tipo (${tipoES || tipo})`;
        const tipoMenu = document.createElement('div');
        tipoMenu.className = 'absolute top-14 left-4 bg-white border rounded-lg shadow-lg p-2 z-50 hidden';
        tipoMenu.style.minWidth = '180px';
        tipoMenu.style.maxHeight = '300px';
        tipoMenu.style.overflowY = 'auto';
        tiposDisponibles.forEach(tipoItem => {
            const item = document.createElement('div');
            item.textContent = tipoItem.nameES;
            item.className = 'cursor-pointer px-3 py-2 hover:bg-yellow-200 rounded capitalize';
            item.addEventListener('click', async () => {
                tipoMenu.classList.add('hidden');
                // Reemplazar el div en la misma posición
                if (sectionDiv.parentNode) {
                    const parent = sectionDiv.parentNode;
                    const index = Array.from(parent.children).indexOf(sectionDiv);
                    const nuevoDiv = await cargarPokesPorTipoConSelector(tipoItem.name, tiposDisponibles, contenedor, true, tipoItem.nameES);
                    parent.replaceChild(nuevoDiv, sectionDiv);
                }
            });
            tipoMenu.appendChild(item);
        });
        tipoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tipoMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', (event) => {
            if (!tipoBtn.contains(event.target) && !tipoMenu.contains(event.target)) {
                tipoMenu.classList.add('hidden');
            }
        });
        tipoSelectorDiv.appendChild(tipoBtn);
        tipoSelectorDiv.appendChild(tipoMenu);
        sectionDiv.appendChild(tipoSelectorDiv);
    // Título de la sección y tarjetas de pokemones
        const titulo = document.createElement('h2');
        titulo.className = 'text-2xl font-extrabold text-red-700 capitalize mb-6';
        titulo.textContent = `Pokemones tipo ${tipoES || tipo}`;
        sectionDiv.appendChild(titulo);
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto';
        const listaParaRender = detallesUnicos && detallesUnicos.length ? detallesUnicos : [];
        if (listaParaRender.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'text-gray-600 text-center w-full';
            emptyMsg.textContent = 'No hay pokemones únicos para mostrar en este tipo.';
            cardsContainer.appendChild(emptyMsg);
        }
        listaParaRender.forEach(poke => {
            const pokeCard = document.createElement('div');
            pokeCard.className = 'bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 mx-auto cursor-pointer';
            pokeCard.style.maxWidth = '600px';
            pokeCard.style.width = '100%';
            pokeCard.innerHTML = `
                <div class="p-4 flex flex-col items-center">
                    <img src="${poke.imagen}" alt="${poke.nombre}" class="w-40 h-40 object-contain mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 capitalize">${poke.nombre}</h3>
                    <p class="text-sm text-gray-600 mt-1">Tipo: ${poke.tipos.join(', ')}</p>
                </div>
            `;
            pokeCard.addEventListener('click', async (e) => {
                e.stopPropagation();
                // Crear la tarjeta emergente si no existe
                let modal = document.getElementById('poke-modal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'poke-modal';
                    modal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50';
                    modal.innerHTML = '<div class="modal-content bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative"></div>';
                    document.body.appendChild(modal);
                }
                const modalContent = modal.querySelector('.modal-content');
                modalContent.innerHTML = '<div class="text-center text-gray-600">Cargando...</div>';
                modal.style.display = 'flex';
                // Usar los datos ya provistos por la API Express (número y descripción)
                try {
                    const descripcion = poke.descripcion || '';
                    const pokedexNum = poke.pokedex_number || 'N/A';
                    modalContent.innerHTML = `
                        <button id="close-modal" class="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold">&times;</button>
                        <img src="${poke.imagen}" alt="${poke.nombre}" class="w-32 h-32 object-contain mx-auto mb-2" />
                        <h2 class="text-2xl font-bold text-gray-800 capitalize mb-2">${poke.nombre}</h2>
                        <p class="mb-1"><strong>Tipo:</strong> ${poke.tipos.join(', ')}</p>
                        <p class="mb-1"><strong>Número en Pokédex:</strong> ${pokedexNum}</p>
                        <p class="mb-2"><strong>Descripción:</strong> ${descripcion}</p>
                    `;
                    // Cerrar la tarjeta emergente
                    document.getElementById('close-modal').onclick = () => {
                        modal.style.display = 'none';
                    };
                    // Cerrar al hacer click fuera de la tarjeta
                    modal.onclick = (ev) => {
                        if (ev.target === modal) modal.style.display = 'none';
                    };
                } catch (err) {
                    modalContent.innerHTML = '<span class="text-red-500">No se pudo obtener información extra.</span>';
                }
            });
            cardsContainer.appendChild(pokeCard);
        });
        sectionDiv.appendChild(cardsContainer);
    // Si se llama para reemplazar, devolver el div creado
        if (replaceDiv) return sectionDiv;
        contenedor.appendChild(sectionDiv);
        return sectionDiv;
    } catch (err) {
        console.error('Error al cargar pokemones:', err);
        const msg = document.createElement('p');
        msg.className = 'text-red-500 text-center';
        msg.textContent = 'No se pudieron cargar los pokemones de tipo ' + (tipoES || tipo) + '. ' + (err.message || '');
        if (contenedor) contenedor.appendChild(msg);
    }
}

// Inicializa el menú chiquitito de los tipos y su interacción
function inicializarMenuTipos(tipos) {
    const btn = document.getElementById('btn-tipo');
    const menu = document.getElementById('menu-tipo');
    menu.innerHTML = '';
    tipos.forEach(tipo => {
        const item = document.createElement('div');
        item.textContent = tipo;
        item.className = 'cursor-pointer px-3 py-2 hover:bg-yellow-200 rounded capitalize';
        item.addEventListener('click', async () => {
            menu.classList.add('hidden');
            await mostrarDivsPorTipos([tipo]);
        });
        menu.appendChild(item);
    });
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
    });
    document.addEventListener('click', (event) => {
        if (!btn.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.add('hidden');
        }
    });
}

// inicializa el codigo al cargar la pagina
window.addEventListener('DOMContentLoaded', mostrarTiposAlAzar);
