import { Module } from '@nestjs/common';
import { ForbidService } from './forbid.service';
import { ForbidController } from './forbid.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  exports: [ForbidService],
  controllers: [ForbidController],
  providers: [ForbidService],
})
export class ForbidModule {}
