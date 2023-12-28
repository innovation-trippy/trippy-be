import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { PUBLIC_IMAGE_PATH } from 'src/common/const/path.const';

@Injectable()
export class ImageService {
    constructor(private readonly httpService: HttpService) {}

    getDetectedForbid() {
        return "Hello World!!";
    }

    async test() {
        try {
            let filepath = `/${join(PUBLIC_IMAGE_PATH, 'user_image.jpeg')}`;
            const formData = new FormData();
            formData.append('filepath', filepath);
            const response = await this.httpService.axiosRef.post(
                'https://trippy-ai-be-dreqf.run.goorm.site/upload',
                { filepath: filepath },
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    async detectObjectFromFile(file: Express.Multer.File) {
        try {
            let filepath = `/${join(PUBLIC_IMAGE_PATH, file.filename)}`;
            const formData = new FormData();
            formData.append('filepath', filepath);
            const response = await this.httpService.axiosRef.post(
                'https://trippy-ai-be-dreqf.run.goorm.site/uploadimg',
                { filepath: filepath },
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
