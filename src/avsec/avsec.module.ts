import { Module } from '@nestjs/common';
import { AvsecService } from './avsec.service';
import { AvsecController } from './avsec.controller';
import { ForbidModule } from 'src/forbid/forbid.module';

@Module({
  imports: [ForbidModule],
  controllers: [AvsecController],
  providers: [AvsecService],
  exports: [AvsecService],
})
export class AvsecModule { }
