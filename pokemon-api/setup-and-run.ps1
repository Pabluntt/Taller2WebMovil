<#
  setup-and-run.ps1
  Automatiza:
   - levantar (o iniciar) contenedor Postgres `pokedb` con usuario/devpass
   - esperar a que Postgres esté listo
   - ejecutar `db_init.sql`
   - instalar dependencias, ejecutar seed
   - arrancar la API (en nueva ventana) en el puerto indicado
   - (opcional) servir la app con `npx serve` en 8080 (en nueva ventana)

  Uso (desde la raíz del repo, PowerShell):
    .\setup-and-run.ps1 -Port 3002 -ServeHtml

#>

param(
    [int]$Port = 3002,
    [switch]$ServeHtml
)

function Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Err($msg){ Write-Host "[ERR] $msg" -ForegroundColor Red }

Info "Iniciando setup (PORT=$Port, ServeHtml=$ServeHtml)"

# 1) Docker disponible?
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Warn "Docker no encontrado. El script intentará continuar asumiendo Postgres local.";
} else {
    # 2) Levantar/crear contenedor si no existe
    $exists = docker ps -a --filter "name=pokedb" -q
    if (-not $exists) {
        Info "Creando e iniciando contenedor Postgres 'pokedb'..."
        docker run -d --name pokedb -e POSTGRES_USER=dev -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=pokedb -p 5432:5432 postgres:15
    } else {
        $running = docker ps --filter "name=pokedb" -q
        if (-not $running) {
            Info "Iniciando contenedor existente 'pokedb'..."
            docker start pokedb
        } else {
            Info "Contenedor 'pokedb' ya está corriendo."
        }
    }

    # 3) Esperar a que Postgres esté listo
    Info "Esperando a que Postgres acepte conexiones..."
    $ready = $false
    for ($i=0; $i -lt 30; $i++) {
        docker exec pokedb pg_isready -U dev -d pokedb > $null 2>&1
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
        Start-Sleep -Seconds 2
    }
    if (-not $ready) { Warn "Postgres no respondió en el tiempo esperado. Puedes revisar 'docker logs pokedb'." }

    # 4) Ejecutar esquema (db_init.sql)
    if (Test-Path .\db_init.sql) {
        Info "Copiando y ejecutando db_init.sql en contenedor..."
        docker cp .\db_init.sql pokedb:/db_init.sql
        docker exec -i pokedb psql -U dev -d pokedb -f /db_init.sql
    } else {
        Warn "No se encontró db_init.sql en la raíz. Omisión de creación de esquema."
    }
}

# 5) Instalar dependencias
Info "Instalando dependencias (npm install)..."
npm install

# 6) Ejecutar seed (usa DATABASE_URL si existe, si no usa valor por defecto)
if (Test-Path .env) {
    Info "Usando .env existente para seed."
} else {
    Info "Asignando DATABASE_URL temporal para el seed"
    $env:DATABASE_URL = 'postgres://dev:devpass@localhost:5432/pokedb'
}

Info "Ejecutando seed..."
npm run seed

# 7) Iniciar API en nueva ventana (para mantener logs visibles)
Info "Arrancando API en nueva ventana PowerShell (puerto $Port)..."
$startApiCmd = "$env:PORT=$Port; npm run start"
Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command $startApiCmd" -WorkingDirectory (Get-Location)

if ($ServeHtml) {
    Info "Iniciando servidor estático para la UI en puerto 8080 (nueva ventana)..."
    $serveCmd = "npx serve . -l 8080"
    Start-Process -FilePath powershell -ArgumentList "-NoExit","-Command $serveCmd" -WorkingDirectory (Get-Location)
    Info "Abre http://localhost:8080/html/apiPokes.html en tu navegador."
}

Info "Setup completado. Revisa las ventanas nuevas con la API / serve para logs."
