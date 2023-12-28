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

    async detectObjectFromFile(file: Express.Multer.File) {
        try {
            let filepath = `${join(PUBLIC_IMAGE_PATH, file.filename)}`;
            const params = { filepath };

            const response = await this.httpService.axiosRef.post(
                'https://trippy-ai-be-dreqf.run.goorm.site/upload',
                null,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
