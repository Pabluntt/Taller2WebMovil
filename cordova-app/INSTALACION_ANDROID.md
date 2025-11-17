# 🔧 Instalación Completa de Android SDK para Cordova

## Paso 1: Instalar Android Studio

1. **Descarga Android Studio** desde:
   https://developer.android.com/studio

2. **Ejecuta el instalador** y durante la instalación asegúrate de seleccionar:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device (opcional, para emulador)

3. **Ubicación predeterminada del SDK**:
   ```
   C:\Users\cris1\AppData\Local\Android\Sdk
   ```

4. **Abre Android Studio** después de instalarlo

5. **Ve a Tools → SDK Manager**

6. **En la pestaña "SDK Platforms"**, instala:
   - ✅ Android 13.0 (API Level 33) o superior
   - ✅ Android 12.0 (API Level 31)

7. **En la pestaña "SDK Tools"**, asegúrate de tener instalado:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator (opcional)

8. **Click en "Apply"** para instalar todo

## Paso 2: Verificar la instalación

Abre una nueva ventana de PowerShell y ejecuta:

```powershell
# Verificar que el directorio existe
Test-Path "$env:LOCALAPPDATA\Android\Sdk"
```

Si devuelve `True`, el SDK está instalado correctamente.

## Paso 3: Configurar variables de entorno

**Ya las configuraste antes**, pero verifica que apunten a la ruta correcta:

```powershell
echo $env:ANDROID_HOME
echo $env:ANDROID_SDK_ROOT
```

Deberían mostrar: `C:\Users\cris1\AppData\Local\Android\Sdk`

## Paso 4: Verificar Cordova

Después de instalar Android Studio, abre una **NUEVA** ventana de PowerShell y ejecuta:

```bash
cordova requirements
```

Deberías ver algo como:

```
Requirements check results for android:
Java JDK: installed
Android SDK: installed true
Android target: installed android-33
Gradle: installed
```

## Paso 5: Construir la app

```bash
cd cordova-app
cordova build android
```

## 🚨 Solución Rápida (Sin Android Studio)

Si no quieres instalar Android Studio completo, puedes usar solo las Command Line Tools:

1. Descarga "Command Line Tools only" desde:
   https://developer.android.com/studio#command-tools

2. Extrae el ZIP en: `C:\Users\cris1\Android\cmdline-tools`

3. Configura las variables de entorno para que apunten a esa ubicación

4. Usa `sdkmanager` para instalar los componentes necesarios:

```bash
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

**Pero la opción más sencilla es instalar Android Studio completo.**

## ✅ Checklist

- [ ] Android Studio instalado
- [ ] SDK Manager configurado con API 33
- [ ] Variables de entorno configuradas
- [ ] PowerShell reiniciado
- [ ] `cordova requirements` muestra todo instalado
- [ ] `cordova build android` funciona
