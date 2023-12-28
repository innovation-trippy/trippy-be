import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { AvsecService } from 'src/avsec/avsec.service';
import { PUBLIC_IMAGE_PATH } from 'src/common/const/path.const';

@Injectable()
export class ImageService {
    constructor(
        private readonly httpService: HttpService,
        private readonly avsecService: AvsecService,
        ) {}

    getDetectedForbid() {
        return "Hello World!!";
    }
    
    async test() {
        try {
            let results = [];
            let filepath = `${join(PUBLIC_IMAGE_PATH, 'user_image.jpg')}`;
            const params = { filepath };

            const response = await this.httpService.axiosRef.post(
                'https://trippy-ai-be-dreqf.run.goorm.site/upload',
                null,
                { params }
            );

            const detected_object = response.data.class_name
            let promises = detected_object.map(async item=> {
                const result = await this.avsecService.getForbidInfo(item);
                return result
            });
            await Promise.all(promises).then(result => {
                results = result.reduce((acc, cur) => acc.concat(cur), []);
            });
            return results;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async detectObjectFromFile(file: Express.Multer.File) {
        try {
            let results = [];
            let filepath = `${join(PUBLIC_IMAGE_PATH, file.filename)}`;
            const params = { filepath };

            const response = await this.httpService.axiosRef.post(
                'https://trippy-ai-be-dreqf.run.goorm.site/upload',
                null,
                { params }
            );
            
            const detected_object = response.data.class_name
            let promises = detected_object.map(async item=> {
                const result = await this.avsecService.getForbidInfo(item);
                return result
            });
            await Promise.all(promises).then(result => {
                results = result.reduce((acc, cur) => acc.concat(cur), []);
            });
            return results;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
