import os
import json
import requests
import psycopg2
import psycopg2.extras
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

BASE_URL = "https://api.api-onepiece.com/v2/luffy-gears/en"

PGHOST = os.getenv("PGHOST", "localhost")
PGPORT = int(os.getenv("PGPORT", "5432"))
PGDATABASE = os.getenv("PGDATABASE", "taller")
PGUSER = os.getenv("PGUSER", "postgres")
PGPASSWORD = os.getenv("PGPASSWORD", "postgres")

def get_gears() -> List[Dict[str, Any]]:
    r = requests.get(BASE_URL, timeout=10)
    r.raise_for_status()
    data = r.json()
    return data if isinstance(data, list) else []

