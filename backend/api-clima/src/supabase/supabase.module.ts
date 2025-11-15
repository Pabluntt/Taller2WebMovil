import { Module } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.controller';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;
        if (!url || !key) {
            throw new Error("Missing Supabase environment variables");
        }
        return createClient(url, key);
      },
    },
    SupabaseService,
  ],
  controllers: [SupabaseController],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
