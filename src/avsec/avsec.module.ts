import { Module } from '@nestjs/common';
import { AvsecService } from './avsec.service';
import { AvsecController } from './avsec.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AvsecController],
  providers: [AvsecService],
})
export class AvsecModule { }
