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

@Injectable()
export class SupabaseService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: any) {}

  private readonly table = process.env.SUPABASE_TABLE || 'climas';

  async getAll(): Promise<Clima[]> {
    console.log(`[SupabaseService] Consultando tabla: ${this.table}`);
    const { data, error } = await this.supabase.from(this.table).select('*');
    
    if (error) {
      console.error('[SupabaseService] Error al obtener datos:', error);
      throw error;
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
      throw error;
    }
    return data as Clima;
  }
}
