import { Module } from '@nestjs/common';
import { AvsecService } from './avsec.service';
import { AvsecController } from './avsec.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  controllers: [AvsecController],
  providers: [AvsecService],
})
export class AvsecModule { }
