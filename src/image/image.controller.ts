import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getForbid() {
    return this.imageService.getDetectedForbid();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file?: Express.Multer.File) {
    return this.imageService.detectObjectFromFile(
      file,
    )
  }
}
