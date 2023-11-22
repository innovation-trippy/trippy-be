import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { Observable, catchError, map, throwError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AvsecService {
  constructor(private readonly httpService: HttpService) { }
  get(apiUrl: any) {
    return this.httpService.get(apiUrl)
  }


  findAll() {
    return `This action returns all avsec`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avsec`;
  }


  remove(id: number) {
    return `This action removes a #${id} avsec`;
  }

  getProducts(): Observable<any> {
    const apiUrl = 'https://www.avsec365.or.kr/avsc/airsforbid/list.do?searchCnd=KR&searchWrd=%EB%9D%BC%EC%9D%B4%ED%84%B0';

    return this.httpService.get(apiUrl).pipe(
      map((response) => response.data),
      catchError((error: AxiosError) => {
        console.error('API 요청 중 오류 발생:', error.message);
        return throwError('제품을 가져오지 못했습니다');
      }),
    );
  }
}
