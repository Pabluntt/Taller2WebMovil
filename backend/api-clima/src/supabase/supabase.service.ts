import { Injectable, Inject } from '@nestjs/common';

type Clima = {
  id: number | string;
  city: string;
  lat: number;
  lon: number;
  region?: string;
  img?: string;
  temperature?: number;
  windspeed?: number;
  weathercode?: number;
};

@Injectable()
export class SupabaseService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: any) {}

  private readonly table = process.env.SUPABASE_TABLE || 'climas';

  async getAll(): Promise<Clima[]> {
    const { data, error } = await this.supabase.from(this.table).select('*');
    if (error) {
      throw error;
    }
    return data as Clima[];
  }
}
