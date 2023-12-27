import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
    getForbid() {
        return "Hello World!";
    }

    detectObjectFromFile(file: Express.Multer.File) {
        let filename = file.size;
        return {
          filenames: filename,
        }
    }
}
