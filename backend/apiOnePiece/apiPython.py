import os
import json
import requests
import psycopg2
import psycopg2.extras
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
EXTERNAL_API_URL = "https://api.api-onepiece.com/v2/luffy-gears/en"
DATABASE_URL = os.getenv("DATABASE_URL")

def _conn():
    if not DATABASE_URL:
        raise RuntimeError("La variable de entorno DATABASE_URL no está configurada.")
    sslmode = "require" if "railway.internal" in DATABASE_URL else "prefer"
    return psycopg2.connect(DATABASE_URL, sslmode=sslmode)

def _init_db():
    with _conn() as con, con.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS onepiece_gears (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                count_technique INTEGER DEFAULT 0
            )
        """)

# Fetch de la API externa
def _fetch_from_external_api() -> List[Dict[str, Any]]:
    r = requests.get(EXTERNAL_API_URL, timeout=10)
    r.raise_for_status()
    return r.json() if isinstance(r.json(), list) else []

# Sincroniza la API externa con la BD
def sync_data_to_db():
    _init_db()
    data = _fetch_from_external_api()
    with _conn() as con, con.cursor() as cur:
        for g in data:
            cur.execute("""
                INSERT INTO onepiece_gears (id, name, description, count_technique)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                  name = EXCLUDED.name,
                  description = EXCLUDED.description,
                  count_technique = EXCLUDED.count_technique
            """, (g.get("id"), g.get("name"), g.get("description"), g.get("count_technique", 0)))
    print(f"Sincronizados {len(data)} registros en la tabla 'onepiece_gears'.")

app = FastAPI(title="One Piece Gears API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crea tabla si no existe
@app.on_event("startup")
def on_startup():
    _init_db()

# Endpoint principal
@app.get("/api/onepiece/gears", summary="Obtiene todos los gears desde la BD")
def get_all_gears_from_db():
    with _conn() as con, con.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
        cur.execute("SELECT id, name, description, count_technique FROM onepiece_gears ORDER BY id")
        rows = [dict(r) for r in cur.fetchall()]
        if not rows:
            raise HTTPException(
                status_code=404,
                detail="La base de datos está vacía. Ejecuta el script de sincronización."
            )
        return rows
    
