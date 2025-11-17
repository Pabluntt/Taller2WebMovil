# API Clima - Backend NestJS

API REST que proporciona información meteorológica de ciudades de Chile usando Supabase como base de datos.

## 🚀 Uso

### Instalar dependencias
```bash
npm install
```

### Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
PORT=3000
```

### Iniciar servidor
```bash
# Modo desarrollo
npm run start:dev

# Producción
npm run start:prod
```

El servidor correrá en `http://0.0.0.0:3000`

## 📡 Endpoints

### `GET /climas`
Obtiene todos los datos meteorológicos de las ciudades almacenadas en Supabase.

**Respuesta:**
```json
[
  {
    "id": 1,
    "city": "Santiago",
    "temperature": 25,
    "windspeed": 10,
    "weathercode": 0,
    "lat": -33.45,
    "lon": -70.66,
    "region": "Región Metropolitana",
    "img": "url_imagen",
    "fetched_at": "2025-11-16T...",
    "raw": {...}
  }
]
```

## 📦 Tecnologías
- NestJS
- Supabase (PostgreSQL)
- TypeScript
