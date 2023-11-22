import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvsecModule } from './avsec/avsec.module';

@Module({
  imports: [AvsecModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
