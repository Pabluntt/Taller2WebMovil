import { Injectable, Inject } from '@nestjs/common';

type Clima = {
  id: number;
  city: string;
  lat: number;
  lon: number;
  region: string;
  img: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
  fetched_at: string; // timestamp with time zone
  raw: any; // jsonb
};

// Datos de prueba locales (fallback)
const MOCK_CLIMAS: Clima[] = [
  {
    id: 1,
    city: 'Santiago',
    lat: -33.8688,
    lon: -51.2093,
    region: 'Metropolitana',
    img: 'https://images.unsplash.com/photo-1555881286-cb95348b5a5b?w=400',
    temperature: 22,
    windspeed: 15,
    weathercode: 80,
    fetched_at: new Date().toISOString(),
    raw: null,
  },
  {
    id: 2,
    city: 'Valparaíso',
    lat: -33.0472,
    lon: -71.6127,
    region: 'Valparaíso',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    temperature: 18,
    windspeed: 25,
    weathercode: 1,
    fetched_at: new Date().toISOString(),
    raw: null,
  },
  {
    id: 3,
    city: 'Concepción',
    lat: -36.8201,
    lon: -73.0445,
    region: 'Biobío',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    temperature: 15,
    windspeed: 20,
    weathercode: 61,
    fetched_at: new Date().toISOString(),
    raw: null,
  },
];

@Injectable()
export class SupabaseService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: any) {}

  private readonly table = process.env.SUPABASE_TABLE || 'climas';

  async getAll(): Promise<Clima[]> {
    console.log(`[SupabaseService] Consultando tabla: ${this.table}`);
    const { data, error } = await this.supabase.from(this.table).select('*');
    
    if (error) {
      console.error('[SupabaseService] Error al obtener datos:', error);
      console.log('[SupabaseService] Usando datos de prueba locales');
      return MOCK_CLIMAS;
    }

    if (!data || data.length === 0) {
      console.log('[SupabaseService] No hay datos en Supabase. Usando datos de prueba locales');
      return MOCK_CLIMAS;
    }
    
    console.log(`[SupabaseService] Datos obtenidos exitosamente. Total registros: ${data?.length || 0}`);
    console.log('[SupabaseService] Primeros datos:', JSON.stringify(data?.slice(0, 2), null, 2));
    
    return data as Clima[];
  }

  async getById(id: number): Promise<Clima | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('[SupabaseService] Error al obtener registro por ID:', error);
      // Buscar en datos de prueba
      return MOCK_CLIMAS.find(c => c.id === id) || null;
    }
    return data as Clima;
  }
}
