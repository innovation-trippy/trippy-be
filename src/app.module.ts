import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvsecModule } from './avsec/avsec.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [AvsecModule, ImageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
