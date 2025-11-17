# 📱 Guía para Generar APK - Taller 2 Web Móvil

## 📋 Prerrequisitos

### 1. Instalar Java JDK
- Descargar e instalar [Java JDK 11 o superior](https://www.oracle.com/java/technologies/downloads/)
- Configurar variable de entorno `JAVA_HOME`:
  ```
  JAVA_HOME=C:\Program Files\Java\jdk-11.x.x
  ```

### 2. Instalar Android Studio
- Descargar [Android Studio](https://developer.android.com/studio)
- Durante la instalación, asegúrate de instalar:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device

### 3. Configurar Variables de Entorno
Agregar a las variables de entorno del sistema:

```
ANDROID_HOME=C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
```

Agregar a PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 4. Instalar Gradle (opcional, Android Studio lo incluye)
Cordova usará el Gradle que viene con Android Studio.

## 🚀 Pasos para Generar el APK

### 1. Preparar el proyecto

```bash
cd cordova-app
```

### 2. Agregar plataforma Android (si no la tienes)

```bash
cordova platform add android
```

### 3. Verificar requisitos

```bash
cordova requirements
```

Este comando te dirá si falta algo. Debe mostrar todo en verde ✅

### 4. Generar APK de Debug (para pruebas)

```bash
cordova build android
```

El APK se generará en:
```
cordova-app\platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

### 5. Generar APK de Release (para distribución)

#### Paso 1: Crear una keystore (solo la primera vez)

```bash
keytool -genkey -v -keystore taller2-webmovil.keystore -alias taller2-key -keyalg RSA -keysize 2048 -validity 10000
```

Te pedirá:
- Contraseña para la keystore (guárdala bien!)
- Información personal (nombre, organización, etc.)

#### Paso 2: Build release sin firmar

```bash
cordova build android --release
```

#### Paso 3: Firmar el APK

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore taller2-webmovil.keystore platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk taller2-key
```

#### Paso 4: Optimizar con zipalign (opcional pero recomendado)

```bash
cd %ANDROID_HOME%\build-tools\33.0.0
zipalign -v 4 ..\..\..\..\cordova-app\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk ..\..\..\..\cordova-app\taller2-webmovil-release.apk
```

## 📲 Instalar el APK en tu dispositivo

### Opción 1: Dispositivo físico conectado por USB

1. Habilita "Opciones de desarrollador" en tu Android
2. Activa "Depuración USB"
3. Conecta el dispositivo por USB
4. Ejecuta:

```bash
cordova run android --device
```

O instala directamente el APK:

```bash
adb install platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

### Opción 2: Transferir APK manualmente

1. Copia el APK a tu teléfono (por cable, email, Drive, etc.)
2. En el teléfono, ve a Ajustes > Seguridad > Permitir instalación de apps desconocidas
3. Abre el APK desde el administrador de archivos
4. Instala la app

## ⚠️ IMPORTANTE: Configuración para Dispositivos Físicos

Si vas a probar en un dispositivo Android real (no emulador), necesitas cambiar `localhost` por la IP de tu computadora:

### Obtener tu IP local:

```bash
ipconfig
```

Busca la línea "Dirección IPv4" (ejemplo: 192.168.1.100)

### Actualizar los archivos JavaScript:

**www/clima/api3.js:**
```javascript
const API_URL = 'http://192.168.1.100:3000/climas';
```

**www/onepiece/itemOnePieceAPI.js:**
```javascript
const API_BASE = "http://192.168.1.100:8000/api/onepiece/gears";
```

**www/pokemon/itemPokes.js:**
```javascript
const API_BASE = 'http://192.168.1.100:3001';
```

### Asegúrate de que los backends acepten conexiones externas:

**Backend NestJS (main.ts):**
```typescript
await app.listen(3000, '0.0.0.0'); // Escuchar en todas las interfaces
```

**Backend FastAPI (apiPython.py):**
```bash
uvicorn apiPython:app --reload --host 0.0.0.0 --port 8000
```

**Backend Express (index.js):**
```javascript
app.listen(PORT, '0.0.0.0', () => console.log(`Escuchando en http://0.0.0.0:${PORT}`));
```

## 🔧 Solución de Problemas

### Error: "Android SDK not found"
- Verifica que `ANDROID_HOME` y `ANDROID_SDK_ROOT` estén configurados correctamente
- Reinicia la terminal después de configurar las variables

### Error: "Java not found"
- Verifica que `JAVA_HOME` esté configurado
- Asegúrate de que Java esté en el PATH

### Error de firma del APK
- Verifica que la contraseña de la keystore sea correcta
- Asegúrate de que el alias sea el correcto

### El APK no se instala
- Verifica que hayas habilitado "Instalar apps de origen desconocido"
- Asegúrate de que el APK no esté corrupto

### La app no conecta a los backends
- Verifica que uses la IP correcta (no localhost)
- Asegúrate de que el dispositivo y la PC estén en la misma red WiFi
- Verifica que los firewalls no bloqueen las conexiones

## 📝 Comandos Útiles

```bash
# Ver dispositivos conectados
adb devices

# Ver logs en tiempo real
adb logcat

# Desinstalar la app
adb uninstall com.taller2.webmovil

# Limpiar build anterior
cordova clean android

# Reconstruir desde cero
cordova platform rm android
cordova platform add android
cordova build android
```

## 🎯 Checklist Final

- [ ] Java JDK instalado y configurado
- [ ] Android Studio instalado con SDK
- [ ] Variables de entorno configuradas
- [ ] Cordova instalado globalmente
- [ ] Plataforma Android agregada al proyecto
- [ ] `cordova requirements` muestra todo en verde
- [ ] IPs actualizadas en archivos JS (si usas dispositivo físico)
- [ ] Backends configurados para escuchar en 0.0.0.0
- [ ] Los 3 backends están corriendo
- [ ] APK generado correctamente
- [ ] App instalada en el dispositivo

¡Listo! Tu app móvil está lista para ser distribuida 🎉
