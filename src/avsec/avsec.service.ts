import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { Observable, catchError, map, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { load } from 'cheerio';

const apiUrl = 'https://www.avsec365.or.kr/avsc/airsforbid/list.do?searchCnd=KR&searchWrd=%EB%9D%BC%EC%9D%B4%ED%84%B0';

@Injectable()
export class AvsecService {

  apiSearchUrl = 'https://www.avsec365.or.kr/avsc/airsforbid/list.do?searchCnd=KR&searchWrd=';
  constructor(private readonly httpService: HttpService) { }

  get(apiUrl: any) {
    return this.httpService.get(apiUrl)
  }


  findAll() {
    return `This action returns all avsec`;
  }

  async findOne(id: string): Promise<any> {
    const urlWithId = `${this.apiSearchUrl}${id}`;


    // 금지물품 id를 검색하는 avsec 페이지 가져오기 
    const observe = await this.httpService.get(urlWithId).pipe(
      map((response) => response.data),
      catchError((error: AxiosError) => {
        console.error('API 요청 중 오류 발생:', error.message);
        return throwError('제품을 가져오지 못했습니다');
      }),
    );

    let resultArray = [];

    // 비동기 웹페이지 진행
    await observe.subscribe(
      value => {
        var $ = load(value);
        const popOuter = $('.pop_s_outer');

        // 금지물품 정보
        const trElement = popOuter.find('[id^="tr_"]');
        trElement.each(function () {
          const thText = $(this).find('th').text();
          const thTexts = thText.split('\n').map(item => item.trim()).filter(Boolean);
          resultArray.push(thTexts);

          // 금지 허용 규칙
          const imgElement = $(this).find('img');
          const imgSrcsAndAlt = imgElement.each(function (index) {
            if (index > 0) {
              const imgSrc = $(this).attr('src');
              const imgAlt = $(this).attr('alt');
              resultArray.push({ imgSrc, imgAlt });
            }
          });
        });
        console.log(resultArray);
      },
      error => {
        console.log(error);
        return throwError('웹페이지를 가져오지 못했습니다.');
      });

    console.log(resultArray);
    return resultArray;
  }


  remove(id: number) {
    return `This action removes a #${id} avsec`;
  }

  getProducts(): Observable<any> {
    return this.httpService.get(apiUrl).pipe(
      map((response) => response.data),
      catchError((error: AxiosError) => {
        console.error('API 요청 중 오류 발생:', error.message);
        return throwError('제품을 가져오지 못했습니다');
      }),
    );
  }
}
