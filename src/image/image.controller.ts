import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getForbid() {
    return this.imageService.getForbid();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  uploadFile(
    @UploadedFiles() 
    files: Array<Express.Multer.File>) {
    let filename = [];
    for (const file of files) {
      filename.push(filename);
    }
    return {
      filenames: filename,
    }
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
