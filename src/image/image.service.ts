import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { PUBLIC_IMAGE_PATH } from 'src/common/const/path.const';

@Injectable()
export class ImageService {
    getDetectedForbid() {
        return "Hello World!!";
    }

    getUserImage() {
        return {
            image: `/${join(PUBLIC_IMAGE_PATH, `user_image`)}`,
        }
    }

    detectObjectFromFile(file: Express.Multer.File) {
        let filepath = `/${join(PUBLIC_IMAGE_PATH, file.filename)}`;
        return {
          filenames: filepath,
        }
    }
}
