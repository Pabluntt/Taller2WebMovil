// URL del backend
const API_URL = 'http://localhost:3000/climas';

// Datos de respaldo (fallback) si el backend no está disponible


async function cargarClima() {
    const grid = document.querySelector('.grid');
    let expandedCard = null;
    let filteredCities = [];
    let citiesData = [];

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
            const card = document.createElement('div');
            card.className = 'bg-white rounded shadow p-2 m-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col max-w-full';
            card.innerHTML = `
                <img src="${city.img || 'https://via.placeholder.com/400'}" alt="${city.city || city.name}" class="rounded w-full h-40 object-cover mb-2 card-img transition-all duration-300" />
                <div class="flex-1">
                    <h2 class="font-bold text-lg mb-1 card-title">${city.city || city.name}</h2>
                    <p class="text-gray-700 card-temp">Temperatura: ${city.temperature != null ? city.temperature + '°C' : 'N/A'}</p>
                    <p class="text-gray-500 card-wind">Viento: ${city.windspeed != null ? city.windspeed + ' km/h' : 'N/A'}</p>
                    <p class="text-gray-400 card-desc">Clima: ${city.weathercode != null ? getWeatherDescription(city.weathercode) : 'N/A'}</p>
                    <div class="extra-details hidden mt-2">
                        <p class="text-gray-600">Latitud: ${city.lat}</p>
                        <p class="text-gray-600">Longitud: ${city.lon}</p>
                        <p class="text-gray-600">Región: ${city.region || 'N/A'}</p>
                        <p class="text-gray-600">Código clima: ${city.weathercode != null ? city.weathercode : 'N/A'}</p>
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

    // Intentar obtener datos desde el backend
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Backend no disponible');
        }
        citiesData = await response.json();
        console.log('Datos obtenidos del backend:', citiesData);
    } catch (error) {
        console.warn('No se pudo conectar al backend, usando datos de respaldo:', error);
        // Si falla el backend, usar Open-Meteo directamente como respaldo
        citiesData = await Promise.all(cities.map(async city => {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
                const weatherData = await res.json();
                return {
                    ...city,
                    city: city.name,
                    temperature: weatherData.current_weather?.temperature,
                    windspeed: weatherData.current_weather?.windspeed,
                    weathercode: weatherData.current_weather?.weathercode
                };
            } catch (err) {
                console.error(`Error obteniendo clima para ${city.name}:`, err);
                return { ...city, city: city.name };
            }
        }));
    }

    filteredCities = citiesData;
    renderCities(filteredCities);

    // Filtro por comuna/region
    window.filtrarClima = function(valor) {
        valor = valor.toLowerCase();
        filteredCities = citiesData.filter(c => {
            const cityName = (c.city || c.name || '').toLowerCase();
            const region = (c.region || '').toLowerCase();
            return cityName.includes(valor) || region.includes(valor);
        });
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