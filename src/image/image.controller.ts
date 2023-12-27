import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getForbid() {
    return this.imageService.getDetectedForbid();
  }

  @Get('file')
  getImage() {
    return this.imageService.getUserImage();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file?: Express.Multer.File) {
    return this.imageService.detectObjectFromFile(
      file,
    )
  }

  @Post('uploadAndValidate')
  uploadAndValidate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg'}),
        ],
      }),
    )
    file: Express.Multer.File
  ) {
    return {
      file: file.filename,
    }
  }
}
