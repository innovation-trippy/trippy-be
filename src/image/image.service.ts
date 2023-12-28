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
            console.log(response.data)
            const detected_object = await response.data.class_names
            console.log(detected_object);
            // detected_object.forEach(item=> {
            //     console.log(item);
            //     const result = this.avsecService.getForbidInfo(item);
            //     results.push(result);
            // });
            // console.log(results)
            // return results;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
