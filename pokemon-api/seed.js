// Script para insertar datos de ejemplo en la tabla `pokemons`.
// Uso: desde la carpeta pokemon-api establece DATABASE_URL en el entorno
// y ejecuta: node seed.js  (o npm run seed)

const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5444/postgres';
const pool = new Pool({ connectionString });

const sample = [
  {
    name: 'Pikachu',
    types: ['electric'],
    pokedex_number: 25,
    image_url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
    description: 'Ratón eléctrico.'
  },
  {
    name: 'Charmander',
    types: ['fire'],
    pokedex_number: 4,
    image_url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
    description: 'Pequeño Pokémon de tipo fuego.'
  },
  {
    name: 'Squirtle',
    types: ['water'],
    pokedex_number: 7,
    image_url: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
    description: 'Pequeño Pokémon de tipo agua.'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Conectando a:', connectionString);
    for (const p of sample) {
      const q = `INSERT INTO pokemons(name, types, description, pokedex_number, image_url)
                 VALUES($1, $2, $3, $4, $5) RETURNING *`;
      const values = [p.name, p.types, p.description, p.pokedex_number, p.image_url];
      const res = await client.query(q, values);
      console.log('Insertado:', res.rows[0]);
    }
    console.log('Seed completado.');
  } catch (err) {
    console.error('Error al insertar seed:', err.message || err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
