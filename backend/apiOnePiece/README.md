# Taller 2 - API de One Piece con FastAPI

Este proyecto consiste en una API RESTful desarrollada con FastAPI que sirve datos sobre los "Gears" de Luffy del anime One Piece. Los datos son obtenidos de una API externa, almacenados en una base de datos PostgreSQL y servidos a través de varios endpoints.

El proyecto también incluye un frontend simple desarrollado con HTML, CSS y JavaScript que consume esta API.

## Características

*   API RESTful con FastAPI.
*   Base de datos PostgreSQL gestionada con Psycopg2.
*   Sincronización de datos desde una API externa.
*   Entorno de desarrollo local con entorno virtual.
*   Despliegue en la nube con Railway.

## Tech Stack

*   **Backend:** Python, FastAPI, Uvicorn
*   **Base de Datos:** PostgreSQL
*   **Frontend:** HTML, JavaScript, Tailwind CSS
*   **Despliegue:** Railway

---

## Configuración del Entorno Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina.

### 1. Prerrequisitos

*   Tener instalado [Python 3.10](https://www.python.org/downloads/) o superior.
*   Tener `pip` (el gestor de paquetes de Python) actualizado.

### 2. Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/Taller2WebMovil.git
    cd Taller2WebMovil
    ```

2.  **Crea y activa un entorno virtual:**
    ```bash
    # Crear el entorno
    python -m venv .venv

    # Activar en Windows (PowerShell)
    .\.venv\Scripts\Activate.ps1
    ```

3.  **Instala las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

### 3. Configuración de Variables de Entorno

Para que la aplicación pueda conectarse a la base de datos, necesitas un archivo `.env`.

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Añade la siguiente línea, reemplazando el valor con tu URL de conexión a la base de datos (para desarrollo local, usa la URL pública que te da Railway):

    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```

---

## Ejecución de la Aplicación

1.  **Poblar la Base de Datos (Primera vez):**
    Este comando se conecta a la base de datos configurada en tu `.env` y la llena con los datos de la API externa.

    ```bash
    python backend/apiOnePiece/apiPython.py
    ```

2.  **Iniciar el Servidor FastAPI:**
    Esto inicia el servidor web en tu máquina local.

    ```bash
    uvicorn backend.apiOnePiece.apiPython:app --reload
    ```

3.  **Accede a la API:**
    *   **API en funcionamiento:** La API estará disponible en `http://127.0.0.1:8000`.
    *   **Documentación Interactiva (Swagger):** Puedes probar todos los endpoints en `http://127.0.0.1:8000/docs`.
    *   **Frontend:** Abre el archivo `frontend/html/frontOnePiece.html` en tu navegador para ver la aplicación cliente.