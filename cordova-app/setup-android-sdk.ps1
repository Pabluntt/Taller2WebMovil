# Script para configurar Android SDK en Windows
# Ejecutar como Administrador

Write-Host "=== Configurador de Android SDK para Cordova ===" -ForegroundColor Green
Write-Host ""

# Buscar la ruta del Android SDK
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"

if (Test-Path $androidSdkPath) {
    Write-Host "✓ Android SDK encontrado en: $androidSdkPath" -ForegroundColor Green
} else {
    Write-Host "✗ Android SDK no encontrado en la ubicación predeterminada" -ForegroundColor Red
    Write-Host "Por favor, instala Android Studio primero desde:" -ForegroundColor Yellow
    Write-Host "https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host ""
    $customPath = Read-Host "O ingresa la ruta manualmente (deja vacío para salir)"
    if ([string]::IsNullOrWhiteSpace($customPath)) {
        exit
    }
    $androidSdkPath = $customPath
}

Write-Host ""
Write-Host "Configurando variables de entorno..." -ForegroundColor Yellow

# Configurar variables de entorno del SISTEMA (requiere permisos de administrador)
try {
    [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, [System.EnvironmentVariableTarget]::User)
    [System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdkPath, [System.EnvironmentVariableTarget]::User)
    
    # Actualizar PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
    
    $pathsToAdd = @(
        "$androidSdkPath\platform-tools",
        "$androidSdkPath\tools",
        "$androidSdkPath\tools\bin",
        "$androidSdkPath\cmdline-tools\latest\bin"
    )
    
    foreach ($pathToAdd in $pathsToAdd) {
        if ($currentPath -notlike "*$pathToAdd*") {
            $currentPath = "$currentPath;$pathToAdd"
        }
    }
    
    [System.Environment]::SetEnvironmentVariable("Path", $currentPath, [System.EnvironmentVariableTarget]::User)
    
    Write-Host ""
    Write-Host "✓ Variables de entorno configuradas correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Variables configuradas:" -ForegroundColor Cyan
    Write-Host "  ANDROID_HOME = $androidSdkPath"
    Write-Host "  ANDROID_SDK_ROOT = $androidSdkPath"
    Write-Host ""
    Write-Host "Rutas agregadas al PATH:" -ForegroundColor Cyan
    foreach ($p in $pathsToAdd) {
        Write-Host "  - $p"
    }
    
    Write-Host ""
    Write-Host "IMPORTANTE: Debes CERRAR y ABRIR NUEVAMENTE todas las ventanas de PowerShell" -ForegroundColor Yellow
    Write-Host "para que los cambios surtan efecto." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Después de reiniciar PowerShell, ejecuta:" -ForegroundColor Cyan
    Write-Host "  cordova requirements" -ForegroundColor White
    Write-Host "para verificar que todo esté configurado correctamente." -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "✗ Error al configurar variables de entorno: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Configuración manual:" -ForegroundColor Yellow
    Write-Host "1. Abre 'Editar las variables de entorno del sistema' desde el menú Inicio"
    Write-Host "2. Click en 'Variables de entorno...'"
    Write-Host "3. En 'Variables de usuario', agregar:"
    Write-Host "   - ANDROID_HOME = $androidSdkPath"
    Write-Host "   - ANDROID_SDK_ROOT = $androidSdkPath"
    Write-Host "4. Editar 'Path' y agregar:"
    foreach ($p in $pathsToAdd) {
        Write-Host "   - $p"
    }
}

Write-Host ""
Write-Host "Presiona Enter para salir..."
$null = Read-Host
