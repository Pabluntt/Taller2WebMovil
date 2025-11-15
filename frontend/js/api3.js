// Usaremos Open-Meteo para obtener el clima de algunas ciudades
const cities = [
    { name: 'Santiago', lat: -33.45, lon: -70.66, region: 'Región Metropolitana', img: 'https://dynamic-media.tacdn.com/media/photo-o/2f/0b/0a/34/caption.jpg?w=700&h=500&s=1' },
    { name: 'Ovalle', lat: -30.601, lon: -71.200, region: 'Coquimbo', img: 'https://media.viajando.travel/p/d5f6e02244e67f87124de7f9a67100dc/adjuntos/236/imagenes/000/680/0000680976/ovallejpeg.jpeg' },
    { name: 'Vallenar', lat: -28.576, lon: -70.758, region: 'Atacama', img: 'https://www.geovirtual2.cl/Museovirtual/Vallenar-Atacama-14393n.jpg' },
    { name: 'Coquimbo', lat: -29.953, lon: -71.343, region: 'Coquimbo', img: 'https://dondehospedarse.net/wp-content/uploads/2024/12/donde-alojarse-en-coquimbo-zonas-1024x576.jpeg' },
    { name: 'La Serena', lat: -29.904, lon: -71.244, region: 'Coquimbo', img: 'https://conociendochile.com/wp-content/uploads/2018/01/La-Serena-1.png' },
    { name: 'Antofagasta', lat: -23.650, lon: -70.400, region: 'Antofagasta', img: 'https://www.piensageotermia.com/wp-content/uploads/2014/09/2321488916_def55c592b_z.jpg' },
    { name: 'Valparaíso', lat: -33.047, lon: -71.612, region: 'Valparaíso', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { name: 'Concepción', lat: -36.827, lon: -73.050, region: 'Biobío', img: 'https://ww2.propital.com/hubfs/file_20220616094819.jpg' },
    { name: 'Temuco', lat: -38.735, lon: -72.590, region: 'Araucanía', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80' },
    { name: 'Puerto Montt', lat: -41.469, lon: -72.942, region: 'Los Lagos', img: 'https://denomades.imgix.net/destinos/puerto-varas/487/city-tour-puerto-montt-puerto-varas-id487-838c.jpg?w=907&h=494&fit=crop&q=100&auto=format,compress&fm=webp' },
    { name: 'Maipú', lat: -33.513, lon: -70.761, region: 'Región Metropolitana', img: 'https://assets-lvdm.storage.googleapis.com/wp-content/uploads/2024/03/maipu-8.jpg' },
    { name: 'Puente Alto', lat: -33.614, lon: -70.575, region: 'Región Metropolitana', img: 'https://ifai.cl/wp-content/uploads/2019/06/Puente-Alto-1.jpg' },
    { name: 'Ñuñoa', lat: -33.456, lon: -70.604, region: 'Región Metropolitana', img: 'https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80' },
    { name: 'Providencia', lat: -33.426, lon: -70.617, region: 'Región Metropolitana', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Las Condes', lat: -33.408, lon: -70.567, region: 'Región Metropolitana', img: 'https://media-front.elmostrador.cl/2020/06/LasCondes-700x438.png' }
];


async function cargarClima() {
    const grid = document.querySelector('.grid');
    let expandedCard = null;
    let filteredCities = cities;

    function renderCities(list) {
        grid.innerHTML = '';
        // Si no hay ciudades, cerrar tarjeta expandida y mostrar mensaje
        if (list.length === 0) {
            if (expandedCard) {
                expandedCard.classList.remove(
                    'fixed', 'inset-0', 'z-50', 'overflow-y-auto', 'overflow-x-auto',
                    'h-screen', 'bg-blue-100', 'max-w-full', 'right-0', 'left-0', 'box-border'
                );
                expandedCard.querySelector('.card-img').classList.remove('h-64');
                expandedCard.querySelector('.card-title').classList.remove('text-3xl');
                expandedCard.querySelector('.card-temp').classList.remove('text-xl');
                expandedCard.querySelector('.card-wind').classList.remove('text-lg');
                expandedCard.querySelector('.card-desc').classList.remove('text-lg');
                expandedCard.querySelector('.extra-details').classList.add('hidden');
                expandedCard = null;
            }
            // Mostrar mensaje de no resultados con margen superior
            const msg = document.createElement('div');
            msg.className = 'text-center text-gray-500 w-full py-8 mt-32'; 
            msg.textContent = 'No se encontraron resultados.';
            grid.appendChild(msg);
            return;
        }
        for (const city of list) {
            const res = city._weatherData;
            const weather = res ? res.current_weather : null;
            const card = document.createElement('div');
            card.className = 'bg-white rounded shadow p-2 m-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col max-w-full';
            card.innerHTML = `
                <img src="${city.img}" alt="${city.name}" class="rounded w-full h-40 object-cover mb-2 card-img transition-all duration-300" />
                <div class="flex-1">
                    <h2 class="font-bold text-lg mb-1 card-title">${city.name}</h2>
                    <p class="text-gray-700 card-temp">Temperatura: ${weather ? weather.temperature + '°C' : 'Cargando...'}</p>
                    <p class="text-gray-500 card-wind">Viento: ${weather ? weather.windspeed + ' km/h' : ''}</p>
                    <p class="text-gray-400 card-desc">Clima: ${weather ? getWeatherDescription(weather.weathercode) : ''}</p>
                    <div class="extra-details hidden mt-2">
                        <p class="text-gray-600">Latitud: ${city.lat}</p>
                        <p class="text-gray-600">Longitud: ${city.lon}</p>
                        <p class="text-gray-600">Región: ${city.region}</p>
                        <p class="text-gray-600">Código clima: ${weather ? weather.weathercode : ''}</p>
                    </div>
                </div>
            `;
            card.addEventListener('click', function(e) {
                if (expandedCard && expandedCard !== card) {
                    expandedCard.classList.remove(
                        'fixed', 'inset-0', 'z-50', 'overflow-y-auto', 'overflow-x-auto',
                        'h-screen', 'bg-blue-100', 'max-w-full', 'right-0', 'left-0', 'box-border'
                    );
                    expandedCard.querySelector('.card-img').classList.remove('h-64');
                    expandedCard.querySelector('.card-title').classList.remove('text-3xl');
                    expandedCard.querySelector('.card-temp').classList.remove('text-xl');
                    expandedCard.querySelector('.card-wind').classList.remove('text-lg');
                    expandedCard.querySelector('.card-desc').classList.remove('text-lg');
                    expandedCard.querySelector('.extra-details').classList.add('hidden');
                    expandedCard = null;
                }
                const extra = card.querySelector('.extra-details');
                if (card.classList.contains('fixed')) {
                    card.classList.remove(
                        'fixed', 'inset-0', 'z-50', 'overflow-y-auto', 'overflow-x-auto',
                        'h-screen', 'bg-blue-100', 'max-w-full', 'right-0', 'left-0', 'box-border'
                    );
                    card.querySelector('.card-img').classList.remove('h-64');
                    card.querySelector('.card-title').classList.remove('text-3xl');
                    card.querySelector('.card-temp').classList.remove('text-xl');
                    card.querySelector('.card-wind').classList.remove('text-lg');
                    card.querySelector('.card-desc').classList.remove('text-lg');
                    extra.classList.add('hidden');
                    expandedCard = null;
                } else {
                    card.classList.add(
                        'fixed', 'inset-0', 'z-50', 'overflow-y-auto', 'overflow-x-auto',
                        'h-screen', 'bg-blue-100', 'max-w-full', 'right-0', 'left-0', 'box-border'
                    );
                    card.querySelector('.card-img').classList.add('h-64');
                    card.querySelector('.card-title').classList.add('text-3xl');
                    card.querySelector('.card-temp').classList.add('text-xl');
                    card.querySelector('.card-wind').classList.add('text-lg');
                    card.querySelector('.card-desc').classList.add('text-lg');
                    extra.classList.remove('hidden');
                    expandedCard = card;
                }
                e.stopPropagation();
            });
            grid.appendChild(card);
        }
    }
    // Fetch weather data for all cities and render
    Promise.all(cities.map(async city => {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
        city._weatherData = await res.json();
    })).then(() => renderCities(filteredCities));
    // Filtro por comuna/region
    window.filtrarClima = function(valor) {
        valor = valor.toLowerCase();
        filteredCities = cities.filter(c => c.name.toLowerCase().includes(valor) || c.region.toLowerCase().includes(valor));
        renderCities(filteredCities);
    }
}

// Traducción de weathercode a texto legible
function getWeatherDescription(code) {
    const codes = {
        0: 'Despejado',
        1: 'Principalmente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla con escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna densa',
        56: 'Llovizna congelante ligera',
        57: 'Llovizna congelante densa',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        66: 'Lluvia congelante ligera',
        67: 'Lluvia congelante intensa',
        71: 'Nieve ligera',
        73: 'Nieve moderada',
        75: 'Nieve intensa',
        77: 'Granos de nieve',
        80: 'Chubascos ligeros',
        81: 'Chubascos moderados',
        82: 'Chubascos intensos',
        85: 'Chubascos de nieve ligeros',
        86: 'Chubascos de nieve intensos',
        95: 'Tormenta',
        96: 'Tormenta con granizo ligero',
        99: 'Tormenta con granizo intenso'
    };
    return codes[code] || 'Desconocido';
}

document.addEventListener('DOMContentLoaded', cargarClima);