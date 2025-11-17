# 📥 Instalación de Java JDK para Cordova

## Opción 1: Instalación Automática con Winget (Recomendado)

Abre PowerShell como **Administrador** y ejecuta:

```powershell
winget install Microsoft.OpenJDK.17
```

Después de instalarse, configura la variable de entorno:

```powershell
# Buscar la ruta de instalación de Java
$javaPath = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"

# Si no existe, busca en otra ubicación común
if (-not (Test-Path $javaPath)) {
    $javaPath = Get-ChildItem "C:\Program Files\Microsoft" -Directory | Where-Object {$_.Name -like "jdk-*"} | Select-Object -First 1 -ExpandProperty FullName
}

# Configurar JAVA_HOME
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, [System.EnvironmentVariableTarget]::User)

# Agregar al PATH
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
if ($currentPath -notlike "*$javaPath\bin*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaPath\bin", [System.EnvironmentVariableTarget]::User)
}

Write-Host "✓ Java JDK configurado: $javaPath" -ForegroundColor Green
```

## Opción 2: Instalación Manual

### 1. Descargar Java JDK

Descarga e instala **Java JDK 17** desde:
- **Microsoft OpenJDK**: https://learn.microsoft.com/en-us/java/openjdk/download (Recomendado)
- **Oracle JDK**: https://www.oracle.com/java/technologies/downloads/

### 2. Instalar

Durante la instalación, anota la ruta donde se instala. Por ejemplo:
```
C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot
```

### 3. Configurar JAVA_HOME

**Opción A - PowerShell (Recomendado):**

```powershell
# Reemplaza la ruta con la de tu instalación
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot", [System.EnvironmentVariableTarget]::User)

# Agregar al PATH
$javaHome = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaHome\bin", [System.EnvironmentVariableTarget]::User)
```

**Opción B - GUI:**

1. Busca "Variables de entorno" en el menú Inicio
2. Click en "Editar las variables de entorno del sistema"
3. Click en "Variables de entorno..."
4. En "Variables de usuario", click "Nueva..." y agrega:
   - **Nombre**: `JAVA_HOME`
   - **Valor**: `C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot`
5. Edita la variable **Path** y agrega:
   - `%JAVA_HOME%\bin`

### 4. Verificar la instalación

**Cierra y abre nuevamente PowerShell**, luego ejecuta:

```bash
java -version
javac -version
```

Deberías ver algo como:

```
openjdk version "17.0.13" 2025-10-15
```

### 5. Verificar en Cordova

```bash
cordova requirements
```

Debería mostrar:

```
Requirements check results for android:
Java JDK: installed 17.0.13
Android SDK: installed true
Android target: installed android-33
Gradle: installed
```

## 🚀 Construir la App

Una vez configurado todo:

```bash
cd cordova-app
cordova build android
```

## ✅ Checklist Completo

- [ ] Java JDK 17 instalado
- [ ] JAVA_HOME configurado
- [ ] Java agregado al PATH
- [ ] PowerShell reiniciado
- [ ] `java -version` funciona
- [ ] `javac -version` funciona
- [ ] Android Studio instalado
- [ ] ANDROID_HOME configurado
- [ ] `cordova requirements` muestra todo OK
- [ ] `cordova build android` genera el APK

## 🔧 Comando Todo-en-Uno (Windows con Winget)

Si tienes **winget** instalado, ejecuta esto en PowerShell como Administrador:

```powershell
# Instalar Java JDK
winget install Microsoft.OpenJDK.17

# Esperar unos segundos y luego configurar variables
Start-Sleep -Seconds 5

# Buscar instalación de Java
$javaPath = Get-ChildItem "C:\Program Files\Microsoft" -Directory | Where-Object {$_.Name -like "jdk-*"} | Select-Object -First 1 -ExpandProperty FullName

if ($javaPath) {
    # Configurar JAVA_HOME
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaPath, [System.EnvironmentVariableTarget]::User)
    
    # Agregar al PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
    if ($currentPath -notlike "*$javaPath\bin*") {
        [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaPath\bin", [System.EnvironmentVariableTarget]::User)
    }
    
    Write-Host ""
    Write-Host "✓ Java JDK instalado y configurado en: $javaPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Cierra y abre nuevamente PowerShell" -ForegroundColor Yellow
    Write-Host "Luego ejecuta: java -version" -ForegroundColor Cyan
} else {
    Write-Host "✗ No se pudo encontrar la instalación de Java" -ForegroundColor Red
}
```

Después de ejecutar esto, **cierra y abre nuevamente PowerShell** y prueba:

```bash
cordova build android
```
