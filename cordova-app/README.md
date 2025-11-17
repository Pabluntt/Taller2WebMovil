# Taller 2 Web Móvil - App Cordova

Aplicación móvil que integra tres proyectos web en una sola app usando Apache Cordova:
- **API de Clima**: Consulta el clima de ciudades de Chile
- **One Piece**: Gears de Luffy  
- **Pokémon**: Randomizador Monotype

## 📋 Prerrequisitos

1. **Node.js** (v16 o superior)
2. **Apache Cordova** instalado globalmente:
   ```bash
   npm install -g cordova
   ```
3. **Backends corriendo** (en terminales separadas):
   - Backend NestJS (api-clima): `cd backend/api-clima && npm run start:dev`
   - Backend FastAPI (One Piece): `cd backend/apiOnePiece && uvicorn apiPython:app --reload --port 8000`
   - Backend Express (Pokémon): `cd pokemon-api && npm start`

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
cd cordova-app
npm install
```

### 2. Agregar plataforma Android (si no existe)

```bash
cordova platform add android
```

### 3. Copiar archivos www a la plataforma Android

**Este paso es IMPORTANTE** después de cada cambio en la carpeta `www/`:

```bash
# Windows PowerShell
Copy-Item -Path "www\*" -Destination "platforms\android\app\src\main\assets\www\" -Recurse -Force

# Linux/Mac
cp -r www/* platforms/android/app/src/main/assets/www/
```

## 💻 Desarrollo

### Compilar APK

#### Opción 1: Android Studio (Recomendado)

1. Abrir Android Studio
2. **File → Open** → Seleccionar carpeta `platforms/android`
3. Esperar a que Gradle sincronice
4. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. APK generado en: `platforms/android/app/build/outputs/apk/debug/`

#### Opción 2: Cordova CLI

```bash
cordova build android
```

El APK se generará en: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

### Probar en emulador Android

1. Iniciar un emulador desde Android Studio (AVD Manager)
2. Asegúrate de que los backends estén corriendo
3. Instalar APK en el emulador:
```bash
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 Estructura de la App

```
cordova-app/
├── www/
│   ├── index.html          # Página principal con menú
│   ├── clima/
│   │   ├── api3.html       # Frontend de clima
│   │   └── api3.js
│   ├── onepiece/
│   │   ├── frontOnePiece.html
│   │   ├── itemOnePieceAPI.js
│   │   └── apiOnePiece.css
│   └── pokemon/
│       ├── apiPokes.html
│       ├── itemPokes.js
│       └── apiPokes.css
├── config.xml              # Configuración de Cordova
└── package.json
```

## 🔧 Configuración de Backends

Los backends deben estar corriendo en los siguientes puertos:

- **API Clima (NestJS)**: Puerto 3000
- **One Piece (FastAPI)**: Puerto 8000  
- **Pokémon (Express)**: Puerto 3001

### Iniciar los backends:

**Backend Clima:**
```bash
cd backend/api-clima
npm install
npm run start:dev
```

**Backend One Piece:**
```bash
cd backend/apiOnePiece
pip install -r requirements.txt
python apiPython.py
```

**Backend Pokémon:**
```bash
cd pokemon-api
npm install
npm start
```

### URLs configuradas en la app

Para el **emulador Android**, la app usa `10.0.2.2` (IP especial que mapea a `localhost` de tu PC):

- `http://10.0.2.2:3000/climas` - API Clima
- `http://10.0.2.2:8000/api/onepiece/gears` - API One Piece
- `http://10.0.2.2:3001` - API Pokémon

**⚠️ Importante:** El backend NestJS (api-clima) debe escuchar en `0.0.0.0:3000` para aceptar conexiones desde el emulador. Esto ya está configurado en `backend/api-clima/src/main.ts`.

## 📦 Comandos Útiles

```bash
# Ver plataformas instaladas
cordova platform ls

# Agregar una plataforma
cordova platform add android

# Actualizar Cordova
npm update -g cordova

# Limpiar build
cordova clean

# Ver dispositivos/emuladores conectados
adb devices

# Desinstalar app del emulador
adb uninstall com.taller2.webmovil

# Ver logs en tiempo real
adb logcat | Select-String "chromium"
```

## 🛠️ Solución de Problemas

### Actualizar archivos después de cambios en www/

Cada vez que modifiques archivos en `www/`, debes copiarlos a la plataforma Android:

```bash
# Windows PowerShell
Copy-Item -Path "www\*" -Destination "platforms\android\app\src\main\assets\www\" -Recurse -Force
```

Luego reconstruir el APK.

### El emulador no conecta con el backend

1. Verifica que todos los backends estén corriendo
2. Asegúrate de usar `http://10.0.2.2:[puerto]` (ya configurado)
3. El backend NestJS debe escuchar en `0.0.0.0:3000` (ya configurado en `main.ts`)

### Error de Gradle al compilar

Si recibes errores de versión de Gradle, verifica que `platforms/android/cdv-gradle-config.json` tenga:
```json
{
  "GRADLE_VERSION": "8.10.2",
  "AGP_VERSION": "8.5.2",
  "SDK_VERSION": 35
}
```

### Regenerar plataforma Android

Si tienes problemas persistentes:

```bash
cordova platform remove android
cordova platform add android
# Copiar archivos www nuevamente
Copy-Item -Path "www\*" -Destination "platforms\android\app\src\main\assets\www\" -Recurse -Force
```

### Build de Android falla

1. Asegúrate de tener **Java JDK 17** instalado
2. Verifica **Android SDK 35** y **Build Tools 35.0.0** en Android Studio
3. Configura variables de entorno: `JAVA_HOME` y `ANDROID_HOME`

## 🌐 Desplegar para Producción

Para que la app funcione en dispositivos de otros usuarios (no solo en tu red local):

1. **Desplegar backends** en servidores públicos:
   - Railway, Render, Heroku, AWS, etc.

2. **Actualizar URLs** en los archivos JavaScript:
   - `www/clima/api3.js`
   - `www/onepiece/itemOnePieceAPI.js`
   - `www/pokemon/itemPokes.js`

3. **Recompilar APK** con las nuevas URLs

Ejemplo:
```javascript
// En lugar de (emulador):
const API_URL = 'http://10.0.2.2:3000/climas';

// Usar (producción):
const API_URL = 'https://tu-backend-clima.railway.app/climas';
```

## 📄 Licencia

Este proyecto es parte del Taller 2 de Desarrollo Web Móvil.
