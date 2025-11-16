-- Crea la tabla pokemons en Postgres
CREATE TABLE IF NOT EXISTS pokemons (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  types TEXT[] DEFAULT ARRAY[]::text[],
  description TEXT,
  pokedex_number INT,
  image_url TEXT
);
