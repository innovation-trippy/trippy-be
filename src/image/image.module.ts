import { BadRequestException, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { IMAGE_FOLDER_PATH } from 'src/common/const/path.const';
import { HttpModule } from '@nestjs/axios';

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
      },
      storage: multer.diskStorage({
        destination: function(req, res, cb) {
          cb(null, IMAGE_FOLDER_PATH)
        },
        filename: function(req, file, cb) {
          cb(null, `user_image${extname(file.originalname)}`)
        }
      })
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 8000,
        maxRedirects: 5,
      }),
    }),
  ]
})
export class ImageModule {}
