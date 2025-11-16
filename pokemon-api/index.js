// Express API mínima para pokemons usando Postgres
// Endpoints:
// GET  /pokemons           -> lista (opcional ?type=fire&limit=6)
// GET  /pokemons/:id       -> detalle por id
// POST /pokemons           -> crear pokemon (body: { name, types: [], description, pokedex_number, image_url })

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://dev:devpass@localhost:5432/pokedb'
});

// Listar pokemons, opcional filter por tipo y limit
app.get('/pokemons', async (req, res) => {
  try {
    const type = req.query.type;
    const limit = parseInt(req.query.limit || '100', 10);
    if (type) {
      const q = 'SELECT * FROM pokemons WHERE $1 = ANY(types) ORDER BY id ASC LIMIT $2';
      const { rows } = await pool.query(q, [type, limit]);
      return res.json(rows);
    } else {
      const q = 'SELECT * FROM pokemons ORDER BY id ASC LIMIT $1';
      const { rows } = await pool.query(q, [limit]);
      return res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Obtener por id
app.get('/pokemons/:id', async (req, res) => {
  try {
    const q = 'SELECT * FROM pokemons WHERE id = $1';
    const { rows } = await pool.query(q, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Crear pokemon (para seed / dev)
app.post('/pokemons', async (req, res) => {
  try {
    const { name, types = [], description = null, pokedex_number = null, image_url = null } = req.body;
    const q = 'INSERT INTO pokemons(name, types, description, pokedex_number, image_url) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const { rows } = await pool.query(q, [name, types, description, pokedex_number, image_url]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Express API escuchando en http://localhost:${PORT}`));
