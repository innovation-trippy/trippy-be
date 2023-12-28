import { Module } from '@nestjs/common';
import { AvsecService } from './avsec.service';
import { AvsecController } from './avsec.controller';

@Module({
  imports: [],
  controllers: [AvsecController],
  providers: [AvsecService],
  exports: [AvsecService],
})
export class AvsecModule { }
