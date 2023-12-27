import { BadRequestException, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 10000000, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false,
          );
        }

        return cb(null, true);
        
      }
    })
  ]
})
export class ImageModule {}
