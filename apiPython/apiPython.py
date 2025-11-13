import os
import argparse
import requests
import json
from typing import Any, Dict, List, Optional
import psycopg2
import psycopg2.extras

BASE_URL = "https://api.api-onepiece.com/v2/luffy-gears/en"
PGHOST = os.getenv("PGHOST", "localhost")
PGPORT = int(os.getenv("PGPORT", "5432"))
PGDATABASE = os.getenv("PGDATABASE", "taller")
PGUSER = os.getenv("PGUSER", "postgres")
PGPASSWORD = os.getenv("PGPASSWORD", "postgres")

# Consumo normal a la API
def get_gears() -> List[Dict[str, Any]]:
    r = requests.get(BASE_URL, timeout=10)
    r.raise_for_status()
    data = r.json()
    return data if isinstance(data, list) else []

def get_gear_by_name(name: str) -> Optional[Dict[str, Any]]:
    objetivo = name.strip().lower()
    gears = get_gears()

    for g in gears:
        if str(g.get("name", "")).strip().lower() == objetivo:
            return g
    
    for g in gears:
        if objetivo in str(g.get("name", "")).lower():
            return g
    return None

# BD postgreSQL
def _conn():
    return psycopg2.connect(
        host=PGHOST, port=PGPORT, dbname=PGDATABASE, user=PGUSER, password=PGPASSWORD
    )

def _init_db():
    with _conn() as con, con.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS gears (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                count_technique INTEGER DEFAULT 0
            )
        """)

def sync_gears_to_db() -> int:
    _init_db()
    data = get_gears()
    with _conn() as con, con.cursor() as cur:
        for g in data:
            cur.execute("""
                INSERT INTO gears (id, name, description, count_technique)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                  name = EXCLUDED.name,
                  description = EXCLUDED.description,
                  count_technique = EXCLUDED.count_technique
            """, (
                g.get("id"),
                g.get("name"),
                g.get("description"),
                g.get("count_technique", 0),
            ))
    return len(data)

def _print_json(data: Any):
    print(json.dumps(data, ensure_ascii=False, indent=2))

def main(argv=None):
    parser = argparse.ArgumentParser(description="Cliente One Piece - Luffy Gears (simple)")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("get", help="Obtener todos los gears")

    getn = sub.add_parser("get-name", help="Obtener un gear por nombre")
    getn.add_argument("--name", required=True, help='Ej: "Gear Second"')

    args = parser.parse_args(argv)

    try:
        if args.cmd == "get":
            _print_json(get_gears())
        elif args.cmd == "get-name":
            res = get_gear_by_name(args.name)
            print("No se encontró el gear solicitado" if not res else json.dumps(res, ensure_ascii=False, indent=2))
    except requests.HTTPError as e:
        print(f"Error HTTP: {e.response.status_code} - {e.response.text}")
    except requests.RequestException as e:
        print(f"Error de red: {e}")

if __name__ == "__main__":
    main()