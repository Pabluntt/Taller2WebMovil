# Pokemon API (Local)

Breve guía para poner en marcha este proyecto localmente (Windows / PowerShell).

**Prerequisitos**:
- Node.js (v16+ recomendado). Verifica con `node -v`.
- npm (v8+). Verifica con `npm -v`.
- Postgres local o Docker (puedes usar el contenedor recomendado abajo).
- Opcional: `npx serve` para servir la carpeta `html`.

**Archivos importantes**:
- `index.js` - servidor Express (API REST).
- `js/itemPokes.js` - código frontend que consume la API.
- `html/apiPokes.html` - página estática principal.
- `db_init.sql`, `seed.js` - esquema y datos de ejemplo.
- `.env` (opcional) - variables de entorno (no subir a git).

**1) Clonar y preparar**
```powershell
git clone <tu-repo-url>
cd pokemon-api
```

**2) Variables de entorno (opcional)**
Crea un `.env` en la raíz si necesitas apuntar a otra DB:
```
DATABASE_URL=postgres://dev:devpass@localhost:5432/pokedb
```
Si no existe `.env`, `index.js` usa por defecto `postgres://dev:devpass@localhost:5432/pokedb`.

**3) Levantar Postgres**
Opción A — Docker (rápido):
```powershell
docker run -d --name pokedb -e POSTGRES_USER=dev -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=pokedb -p 5432:5432 postgres:15
```

Opción B — Postgres local: asegúrate de que el servicio está corriendo.

**4) Crear esquema**
Si usas Docker (contendor `pokedb`):
```powershell
docker cp .\db_init.sql pokedb:/db_init.sql
docker exec -it pokedb psql -U dev -d pokedb -f /db_init.sql
```

Si usas Postgres local con `psql`:
```powershell
psql -h localhost -U postgres -c "CREATE DATABASE pokedb;"
psql -h localhost -U postgres -d pokedb -f .\db_init.sql
```

**5) Instalar dependencias y seed**
```powershell
npm install
# Si necesitas apuntar a otra DB para el seed, exporta DATABASE_URL antes
# Por ejemplo: $env:DATABASE_URL='postgres://dev:devpass@localhost:5432/pokedb'
npm run seed
```

**6) Iniciar la API (puerto configurable)**
Por defecto `index.js` usa `process.env.PORT || 3001`.
Si quieres arrancar en `3002` (como usa el frontend aquí):
```powershell
$env:PORT=3002; npm run start
```

**7) Servir el frontend (dos opciones)**
Opción (recomendada): servir la raíz del proyecto para que las rutas relativas funcionen:
```powershell
npx serve . -l 8080
# Abrir en el navegador:
# http://localhost:8080/html/apiPokes.html
```

Opción (si prefieres servir solo la carpeta `html`): copia `itemPokes.js` dentro de `html/js` y actualiza la ruta en `html/apiPokes.html` a `./js/itemPokes.js`.

**8) Verificar en el navegador**
- Abre DevTools (F12) → Consola y Network.
- Busca el log `Cargando pokemons desde ...` y `Pokemons recibidos (raw):` que imprime el frontend.

**Solución de problemas comunes**
- Error `EADDRINUSE` al arrancar la API: otro proceso usa el puerto. Mata el proceso o usa `npx kill-port 3002`.
- Si el script `itemPokes.js` no carga (404) cuando sirves solo `html`, copia el JS a `html/js` o sirve la raíz del proyecto.
- Si ves pokemons duplicados: el frontend aplica una deduplicación por `pokedex_number`/`nombre`, pero lo correcto es arreglar la fuente (DB/API). Revisa la respuesta del endpoint:
```powershell
Invoke-RestMethod -Uri 'http://localhost:3002/pokemons?type=fire&limit=6' | ConvertTo-Json -Depth 5
```

**Notas para desarrollo**
- `index.js` habilita `cors()` por defecto para llamadas desde `http://localhost:8080`.
- Asegúrate de que `API_BASE` en `js/itemPokes.js` coincide con el puerto donde arranca el servidor (ej. `http://localhost:3002`).

**.gitignore**
Hay un `.gitignore` añadido con reglas para `node_modules`, `.env`, logs, etc.

¿Quieres que también añada un `.env.example` con la variable mínima `DATABASE_URL` y un pequeño script PowerShell que automatice levantar Docker, ejecutar el esquema y arrancar la API? Puedo añadirlo si quieres.
# Pokemon API (export)

Este paquete contiene sólo el backend Express de la API de Pokemons y el frontend mínimo que consume esa API.

Estructura relevante:

- `index.js` - servidor Express (endpoints: `GET /pokemons`, `GET /pokemons/:id`, `POST /pokemons`)
- `seed.js` - script para insertar datos de ejemplo
- `db_init.sql` - DDL para crear la tabla `pokemons`
- `Dockerfile` - imagen para correr la API
- `package.json` - scripts: `start`, `start:dev`, `seed`
- `html/apiPokes.html` - frontend que consume la API
- `js/itemPokes.js` - lógica frontend (apunta por defecto a `http://localhost:3002`)
- `css/apiPokes.css` - estilos mínimos
- `.env.example` - ejemplo de variables de entorno

Instrucciones (local, con Postgres en Docker):

1. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` (host/puerto/usuario/contraseña).

2. Asegúrate de tener la tabla:
   - Conéctate a tu DB y ejecuta `db_init.sql`, o usa psql:
     `psql "$DATABASE_URL" -f db_init.sql`

3. Instala dependencias e inserta seed:
   - `npm install`
   - `npm run seed`  (esto usa `DATABASE_URL` de `.env`)

4. Ejecuta la API:
   - `npm start`  (o `npm run start:dev` si tienes `nodemon`)

5. Abre el frontend:
   - Abre `html/apiPokes.html` en tu navegador (puedes servir la carpeta con `npx serve` o cualquier servidor estático). Asegúrate que `itemPokes.js` apunte a la URL correcta de la API (ver `API_BASE` dentro de `js/itemPokes.js`).

Notas para despliegue (p. ej. Railway):
- Define la variable de entorno `DATABASE_URL` que te provea Railway.
- Define `PORT` en variables de entorno si Railway asigna otro puerto.
- Para producción usa la imagen Docker definida en `Dockerfile`.

Si quieres, puedo:
- Crear un `docker-compose.yml` para arrancar Postgres + API localmente.
- Añadir una ruta `/docs` con Swagger (documentación interactiva).
- Ajustar el frontend para que la URL de la API provenga de un archivo `config.json` o de `process.env` en tiempo de build.
