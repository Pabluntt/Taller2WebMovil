import { Controller, Get, Param, Sse } from '@nestjs/common';
import { Observable, from, map, interval, mergeMap } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Controller('climas')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    return this.supabaseService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.supabaseService.getById(parseInt(id));
  }

  // SSE: emisión única (se conecta, envía los datos actuales y cierra)
  @Sse('stream')
  streamOnce(): Observable<MessageEvent> {
    return from(this.supabaseService.getAll()).pipe(
      map((data) => {
        const payload = JSON.stringify(data);
        return { data: payload } as unknown as MessageEvent;
      }),
    );
  }

  // SSE: transmisión periódica cada 5 segundos (mantiene la conexión y envía actualizaciones)
  @Sse('stream/periodic')
  streamPeriodic(): Observable<MessageEvent> {
    return interval(5000).pipe(
      mergeMap(() => from(this.supabaseService.getAll())),
      map((data) => {
        const payload = JSON.stringify(data);
        return { data: payload } as unknown as MessageEvent;
      }),
    );
  }
}
